const { BrowserWindow, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { Channel } = require("../shared/communication");
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
        this.openWindow = this.openWindow.bind(this);
        this.openDevTools = this.openDevTools.bind(this);
        this.start = 0;
        this.end = coversPerPage;
        this.coversPerPage = coversPerPage;
        this.folders = [];
        this.albums = [];
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

    loadPage(page) {
        this.start = page * this.coversPerPage;
        this.end = this.start + this.coversPerPage;
        console.log("Notifying albums: ", {start: this.start, end: this.end});
        for(var i = this.start; i < this.end; i++) {
            this.#notifyAlbum(this.albums[i]);
        }
    }

    #loadFolders() {
        this.#processFolders(this.folders);
        this.#notifyPageInfo();
    }

    #processAlbum(album) {
        if(album.count > 0) {
            this.albums.push(album);
            if(this.albums.length < this.end) {
                this.#notifyAlbum(album);
            }
        }
    }

    #getSubFolders(folder) {
        return fs.readdirSync(folder, { withFileTypes: true })
            .filter(f => f.isDirectory())
            .map(f => path.join(folder, f.name));
    }

    #processFolders(folders) {
        var toProcess = [...folders];
        while(toProcess.length > 0) {
            var folder = toProcess.shift();
            this.#processAlbum(this.#createAlbum(path.basename(folder), folder));
            this.#getSubFolders(folder).forEach(f => toProcess.push(f));
        }
    }

    #loadWindow(folders) {
        this.folders = folders;
        this.window = new BrowserWindow(SELECTOR_WINDOW_PROPERTIES);
        this.window.title = "Album Auswahl";
        this.folders = folders;
        this.window.loadFile("public/selector/view.html")
            .then(() => this.#loadFolders());
    }

    #notifyAlbum(album) {
        this.window.webContents.send(Channel.NOTIFY_ALBUM, album);
    }

    #notifyPageInfo() {
        var pageInfo = this.#createPageInfo();
        console.log("Sending pageInfo: ", pageInfo);
        this.window.webContents.send(Channel.NOTIFY_PAGE_INFO, pageInfo);
    }
    
    openWindow() {
        this.albums = [];
        this.start = 0;
        this.end = this.coversPerPage;
        this.folders = [];
        dialog.showOpenDialog({ properties: [ 'openDirectory', 'multiSelections' ]})
            .then(result => this.#loadWindow(result.filePaths));
    }

    openDevTools() {
        this.window.webContents.openDevTools({ mode: "detach" });
    }
}

exports.selector = new AlbumSelector(COVERS_PER_PAGE);