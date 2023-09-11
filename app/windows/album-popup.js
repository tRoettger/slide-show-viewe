const { Menu } = require("electron");
const path = require("path");
const { Channel } = require("../../shared/communication");
const { fileService } = require("../services/FileService");

class AlbumPopup {
    constructor() {}

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
        this.window.webContents.send(Channel.NOTIFY_ALBUM_CHANGED, this.album)
    }

    popup(options, window) {
        this.album = options.album;
        this.window = window;
        this.menu.popup(window);
    }
}

exports.albumPopup = new AlbumPopup();
this.albumPopup.initMenu();