const { BrowserWindow, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { Channel, FilterType } = require("../shared/communication");
const { isImage } = require("../shared/slide-show");
const { loadFiles } = require("./fs-actions");
const { COVERS_PER_PAGE } = require("../shared/constants");

const SELECTOR_WINDOW_PROPERTIES = {
    width: 1080, height: 720,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    autoHideMenuBar: true
};

class AlbumSelector {
    constructor(coversPerPage) {
        this.filterAlbums = this.filterAlbums.bind(this);
        this.openWindow = this.openWindow.bind(this);
        this.openDevTools = this.openDevTools.bind(this);
        this.start = 0;
        this.end = coversPerPage;
        this.coversPerPage = coversPerPage;
        this.folders = [];
        this.albums = [];
        this.allAlbums = [];
    }

    #createAlbum(name, folder) {
        var files = loadFiles([folder])
            .filter(isImage);
        return {
            cover: files[0],
            count: files.length,
            folder: folder,
            name: name
        };
    }

    #createPageInfo() {
        return {
            count: Math.ceil(this.albums.length / this.coversPerPage)
        };
    }

    #filterByName(name) {
        if(name.length == 0) {
            this.albums = [...this.allAlbums];
        } else {
            this.albums = this.allAlbums
                .filter(album => album.name.includes(name));
        }
        this.#notifyPageInfo();
        this.loadPage(0);
    }

    #getSubFolders(folder) {
        return fs.readdirSync(folder, { withFileTypes: true })
            .filter(f => f.isDirectory())
            .map(f => path.join(folder, f.name));
    }

    #loadFolders() {
        this.#processFolders(this.folders);
        this.#notifyPageInfo();
    }

    #loadWindow(folders) {
        if(folders.length > 0) {
            this.folders = folders;
            this.window = new BrowserWindow(SELECTOR_WINDOW_PROPERTIES);
            this.window.title = "Album Auswahl";
            this.folders = folders;
            this.window.loadFile("public/selector/view.html")
                .then(() => this.#loadFolders());
        }
    }

    #notifyAlbum(album) {
        this.window.webContents.send(Channel.NOTIFY_ALBUM, album);
    }

    #notifyPageInfo() {
        var pageInfo = this.#createPageInfo();
        console.log("Sending pageInfo: ", pageInfo);
        this.window.webContents.send(Channel.NOTIFY_PAGE_INFO, pageInfo);
    }

    #processAlbum(album) {
        if(album.count > 0) {
            this.albums.push(album);
            if(this.albums.length < this.end) {
                this.#notifyAlbum(album);
            }
        }
    }

    #processFolders(folders) {
        var toProcess = [...folders];
        while(toProcess.length > 0) {
            var folder = toProcess.shift();
            this.#processAlbum(this.#createAlbum(path.basename(folder), folder));
            this.#getSubFolders(folder).forEach(f => toProcess.push(f));
        }
        this.allAlbums = [...this.albums];
    }

    // Public methods

    filterAlbums(filter) {
        if(filter.type == FilterType.NAME) {
            this.#filterByName(filter.value);
        }
    }

    loadPage(page) {
        this.start = page * this.coversPerPage;
        this.end = this.start + this.coversPerPage;
        for(var i = this.start; i < this.end; i++) {
            this.#notifyAlbum(this.albums[i]);
        }
    }

    openDevTools() {
        this.window.webContents.openDevTools({ mode: "detach" });
    }
    
    openWindow() {
        this.albums = [];
        this.start = 0;
        this.end = this.coversPerPage;
        this.folders = [];
        dialog.showOpenDialog({ properties: [ 'openDirectory', 'multiSelections' ]})
            .then(result => this.#loadWindow(result.filePaths));
    }
}

exports.selector = new AlbumSelector(COVERS_PER_PAGE);