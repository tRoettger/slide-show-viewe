const { BrowserWindow, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { isImage } = require("../model/imageFileHelper");
const { albumPopupMenu: albumPopup } = require("./AlbumPopupMenu");
const { serverApi } = require("../communication/serverApi");
const { fileService } = require("../services/FileService");
const { FilterType } = require("../model/AlbumUtils");

const COVERS_PER_PAGE = 20;

const SELECTOR_WINDOW_PROPERTIES = {
    width: 1080, height: 720,
    webPreferences: { 
        sandbox: false,
        preload: path.join(__dirname, "..", "preload.js")
     },
    autoHideMenuBar: true
};

const compareFolder = (a1, a2) => a1.folder.localeCompare(a2.folder);
const compareName = (a1, a2) => a1.name.localeCompare(a2.name);
const compareDate = (a1, a2) => a1.created.getTime() - a2.created.getTime();
const compareSize = (a1, a2) => a1.count - a2.count;

const DEFAULT_COMPARATOR = compareFolder;

const COMPARATORS = new Map();
COMPARATORS.set("path-asc", compareFolder);
COMPARATORS.set("path-desc",  (a1, a2) => compareFolder(a2, a1));
COMPARATORS.set("name-asc", compareName);
COMPARATORS.set("name-desc",  (a1, a2) => compareName(a2, a1));
COMPARATORS.set("date_asc", compareDate);
COMPARATORS.set("date_desc",  (a1, a2) => compareDate(a2, a1));
COMPARATORS.set("size_asc", compareSize);
COMPARATORS.set("size-desc",  (a1, a2) => compareSize(a2, a1));

class AlbumSelector {
    constructor(coversPerPage, albumPopup, albumListener, pageInfoListener) {
        this.filterAlbums = this.filterAlbums.bind(this);
        this.openWindow = this.openWindow.bind(this);
        this.openDevTools = this.openDevTools.bind(this);
        this.showAlbumPopup = this.showAlbumPopup.bind(this);
        this.sortAlbums = this.sortAlbums.bind(this);
        this.start = 0;
        this.end = coversPerPage;
        this.coversPerPage = coversPerPage;
        this.folders = [];
        this.albums = [];
        this.allAlbums = [];
        this.popup = albumPopup;
        this.albumListener = albumListener;
        this.pageInfoListener = pageInfoListener;
    }

    #computeProperties(folder, pictureFiles) {
        var props = fileService.loadAlbumProps(folder);
        if (props && props.cover) {
            props.cover = fileService.parseFilePath(folder, props.cover);
            return props;
        } else {
            return { cover: pictureFiles[0] };
        }
    }

    #createAlbum(name, folder) {
        let files = fileService.loadFiles([folder]);
        var pictureFiles = files.filter(isImage);
        var albumProperties = this.#computeProperties(folder, pictureFiles);
        var stats = fs.statSync(folder);
        return {
            cover: albumProperties.cover,
            count: pictureFiles.length,
            folder: folder,
            created: stats.ctime,
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
            this.window.loadFile(path.join(__dirname, "..", "renderer", "pages", "selector", "view.html"))
                .then(() => this.#loadFolders());
        }
    }

    #notifyAlbum(album) {
        this.albumListener(album);
    }

    #notifyPageInfo() {
        var pageInfo = this.#createPageInfo();
        this.pageInfoListener(pageInfo);
    }

    #processAlbum(album) {
        if(album.count > 0) {
            this.albums.push(album);
            if(this.albums.length <= this.end) {
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

    showAlbumPopup(options) {
        this.popup.popup(options, this.window);
    }

    sortAlbums(order) {
        var sorter = COMPARATORS.get(order) || DEFAULT_COMPARATOR;
        this.albums.sort(sorter)
        this.allAlbums.sort(sorter);
        this.#notifyPageInfo();
        this.loadPage(0);
    }
}

exports.selector = new AlbumSelector(
    COVERS_PER_PAGE, 
    albumPopup, 
    serverApi.broadcastAlbumNotification,
    serverApi.broadcastPageInfo
);
serverApi.registerSelector(this.selector);