const { dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { isImage } = require("../model/imageFileHelper");
const { albumPopupMenu: albumPopup } = require("../windows/AlbumPopupMenu");
const { serverApi } = require("../communication/serverApi");
const { fileService } = require("./FileService");
const { FilterType } = require("../model/AlbumUtils");

const COVERS_PER_PAGE = 20;

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

const NOTHING_TO_LOAD_ERROR = "NOTHING_TO_LOAD_ERROR";

class AlbumSelector {
    constructor(coversPerPage, albumPopup, albumListener, pageInfoListener) {
        this.filterAlbums = this.filterAlbums.bind(this);
        this.selectRootFolder = this.selectRootFolder.bind(this);
        this.showAlbumPopup = this.showAlbumPopup.bind(this);
        this.sortAlbums = this.sortAlbums.bind(this);
        this.clear = this.clear.bind(this);
        
        this.coversPerPage = coversPerPage;
        this.popup = albumPopup;
        this.albumListener = albumListener;
        this.pageInfoListener = pageInfoListener;
        this.clear();
    }

    clear() {
        this.start = 0;
        this.end = this.coversPerPage;
        this.albums = [];
        this.allAlbums = [];
        this.#notifyPageInfo();
    }

    #computeProperties(folder, pictureFiles) {
        let props = fileService.loadAlbumProps(folder);
        if (props && props.cover) {
            try {
                props.cover = fileService.parseFilePath(folder, props.cover);
            } catch (error) {
                console.error("Could not load cover file. Using default cover.", error);
                props.cover = pictureFiles[0];
            }
            return props;
        } else {
            return { cover: pictureFiles[0] };
        }
    }

    #createAlbum(name, folder) {
        let files = fileService.loadFiles([folder]);
        let pictureFiles = files.filter(isImage);
        let albumProperties = this.#computeProperties(folder, pictureFiles);
        let stats = fs.statSync(folder);
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
    }

    #getSubFolders(folder) {
        return fs.readdirSync(folder, { withFileTypes: true })
            .filter(f => f.isDirectory())
            .map(f => path.join(folder, f.name));
    }

    #loadFolders(folders) {
        if(folders.length > 0) {
            const newAlbums = this.#processFolders(folders);
            if(newAlbums.length > 0) {
                this.allAlbums = [...this.allAlbums, ...newAlbums];
                this.allAlbums.sort(DEFAULT_COMPARATOR);
                this.albums = [...this.allAlbums];
                this.start = 0;
                this.end = this.coversPerPage;
                
                this.#notifyPageInfo();
            }
        } else {
            throw NOTHING_TO_LOAD_ERROR;
        }
    }

    #notifyAlbum(album) {
        this.albumListener(album);
    }

    #notifyPageInfo() {
        let pageInfo = this.#createPageInfo();
        this.pageInfoListener(pageInfo);
    }

    #processFolders(folders) {
        let toProcess = [...folders];
        const newAlbums = [];
        while(toProcess.length > 0) {
            const folder = toProcess.shift();
            newAlbums.push(this.#createAlbum(path.basename(folder), folder));
            toProcess = [...toProcess, ...this.#getSubFolders(folder)];
        }
        return newAlbums.filter(album => album.count > 0);
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
        this.#notifyAlbums();
    }

    #notifyAlbums() {
        for(let i = this.start; i < this.end; i++) {
            this.#notifyAlbum(this.albums[i]);
        }
    }
    
    selectRootFolder(onLoad) {
        dialog.showOpenDialog({ properties: [ 'openDirectory', 'multiSelections' ]})
            .then(result => this.#loadFolders(result.filePaths))
            .then(onLoad)
            .catch((error) => {
                if(error == NOTHING_TO_LOAD_ERROR) {
                    /* Ignored, this error just prevents the call of the onLoad function. */
                } else {
                    throw error;
                }
            });
    }

    showAlbumPopup(options) {
        this.popup.popup(options);
    }

    sortAlbums(order) {
        let sorter = COMPARATORS.get(order) || DEFAULT_COMPARATOR;
        this.albums.sort(sorter)
        this.allAlbums.sort(sorter);
        this.#notifyPageInfo();
        this.loadPage(0);
    }

    getPageInfo() {
        return this.#createPageInfo();
    }
}

exports.selector = new AlbumSelector(
    COVERS_PER_PAGE, 
    albumPopup, 
    serverApi.broadcastAlbumNotification,
    serverApi.broadcastPageInfo
);
serverApi.registerSelector(this.selector);