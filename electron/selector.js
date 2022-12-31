const { BrowserWindow, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { isImage } = require("../shared/slide-show");
const { loadFiles } = require("./fs-actions");

const SELECTOR_WINDOW_PROPERTIES = {
    width: 640, height: 480,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    autoHideMenuBar: true
};

class AlbumSelector {
    constructor() {
        this.openWindow = this.openWindow.bind(this);
        this.test = "my test";
    }

    #analyseFolder(folder) {
        var subDirs = fs.readdirSync(folder, { withFileTypes: true })
            .filter(f => f.isDirectory());
        var albums = [];
        for(var dir of subDirs) {
            var album = this.#convertToAlbum(path.resolve(folder, dir.name));
            if(album.count > 0) albums.push(album);
        }
        return albums;
    }

    #convertToAlbum(dir) {
        console.log("dir: ", dir);
        var files = loadFiles(dir).filter(isImage);
        return {
            files: files,
            count: files.length,
            name: dir.name
        };
    }

    #loadWindow(folders) {
        this.folders = folders;
        this.window = new BrowserWindow(SELECTOR_WINDOW_PROPERTIES);
        this.window.title = "Album Auswahl";
        this.window.loadFile("public/selector/view.html");
        this.albums = [];
        for(var folder of this.folders) {
            this.#analyseFolder(folder).forEach(this.albums.push);
        }
        this.#notifyAlbums();
    }

    #notifyAlbums() {
        console.log("albums: ", this.albums);
    }
    
    openWindow() {
        dialog.showOpenDialog({ properties: [ 'openDirectory', 'multiSelections' ]})
            .then(result => this.#loadWindow(result.filePaths));
    }
}

exports.selector = new AlbumSelector();