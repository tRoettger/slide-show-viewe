const { Menu } = require("electron");
const path = require("path");
const { fileService } = require("../services/FileService");
const { serverApi } = require("../communication/serverApi");

class AlbumPopupMenu {
    constructor() {
        this.showPopup = () => {};
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
        this.showPopup();
    }

    registerTo(window) {
        this.showPopup = () => window.ifPresent(w => this.menu.popup(w));
    }
}

exports.albumPopupMenu = new AlbumPopupMenu();
this.albumPopupMenu.initMenu();