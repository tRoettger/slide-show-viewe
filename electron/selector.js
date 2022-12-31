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

    #analyseFolder(folder, current) {
        var subDirs = fs.readdirSync(folder, { withFileTypes: true })
            .filter(f => f.isDirectory());
        var index = current;
        for(var dir of subDirs) {
            var album = this.#convertToAlbum(folder, dir);
            if(album.count > 0) {
                this.#processAlbum(album, index++);
            }
        }
    }

    #processAlbum(album, index) {
        this.albums.push(album);
        if(index >= this.start && index < this.end)
            this.#notifyAlbum(album);
    }

    #convertToAlbum(folder, subDir) {
        var files = loadFiles([path.join(folder, subDir.name)])
            .filter(isImage);
        return {
            cover: files[0],
            count: files.length,
            name: subDir.name
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
        for(var i = this.start; i < this.end; i++) {
            this.#notifyAlbum(this.albums[i]);
        }
    }

    #loadFolders() {
        var current = 0;
        for(var folder of this.folders) {
            current += this.#analyseFolder(folder, current);
        }
        this.#notifyPageInfo();
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