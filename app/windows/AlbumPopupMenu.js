const { Menu } = require("electron");
const path = require("path");
const { fileService } = require("../services/FileService");
const { serverApi } = require("../communication/serverApi");
const { getOrCreateAlbumSelectionWindow } = require("./AlbumSelectionWindow");

class AlbumPopupMenu {
    constructor(windowSupplier) {
        this.windowSupplier = windowSupplier;
    }

    initMenu() {
        this.menu = Menu.buildFromTemplate([
            { label: "Cover ändern", "click": () => this.#changeCover() }
        ]);
    }

    #changeCover() {
        fileService.selectImage("Neues Cover auswählen", this.album.folder).then(result => {
            if(!result.canceled) {
                let props = fileService.loadAlbumProps(this.album.folder);
                props ??= {};
                props.cover = path.relative(this.album.folder, result.filePaths[0]);
                this.album.cover = fileService.parseFilePath(this.album.folder, props.cover);
                fileService.storeAlbumProps(this.album.folder, props);
                this.#notifyAlbumUpdate();
            }
        });
    }

    #notifyAlbumUpdate() {
        serverApi.broadcastAlbumChange(this.album);
    }

    popup(options) {
        this.album = options.album;
        this.menu.popup(this.windowSupplier());
    }
}

exports.albumPopupMenu = new AlbumPopupMenu(getOrCreateAlbumSelectionWindow);
this.albumPopupMenu.initMenu();