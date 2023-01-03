const { Menu, dialog } = require("electron");
const { loadAlbumProps, selectImage } = require("./fs-actions");

class AlbumPopup {
    constructor() {}

    initMenu() {
        this.menu = Menu.buildFromTemplate([
            { label: "Cover ändern", "click": () => this.#changeCover() }
        ]);
    }

    #changeCover() {
        selectImage("Neues Cover auswählen", this.album.folder).then(result => {
            if(!result.canceled) {
                var props = loadAlbumProps(this.album.folder);
                props ??= {};
                props.cover = path.relative(this.album.folder, result.filePaths[0]);
                this.album.cover = props.cover;
                storeAlbumProps(this.album.folder, props);
                this.#notifyAlbumUpdate();
            }
        });
    }

    #notifyAlbumUpdate() {
        this.window.webContents.send(Channel.NOTIFY_COVER_CHANGED, this.album)
    }

    popup(options, window) {
        this.album = options.album;
        this.window = window;
        this.menu.popup(window);
    }
}

exports.albumPopup = new AlbumPopup();
this.albumPopup.initMenu();