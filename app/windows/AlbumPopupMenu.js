const { Menu } = require("electron");
const path = require("path");
const { fileService } = require("../services/FileService");
const { serverApi } = require("../communication/serverApi");

class AlbumPopupMenu {
    constructor() {
        this.showPopup = (menu) => {};
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
        const menu = Menu.buildFromTemplate([
            { label: this.album.name, enabled: false },
            { type: "separator" },
            { label: "Cover ändern", "click": () => this.#changeCover() }
        ]);
        this.showPopup(menu);
    }

    registerTo(window) {
        this.showPopup = (menu) => window.ifPresent(w => menu.popup(w));
    }
}

exports.albumPopupMenu = new AlbumPopupMenu();