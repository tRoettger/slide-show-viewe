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
                storeAlbumProps(this.album.folder, props);
            }
        });
    }

    popup(options, window) {
        this.album = options.album;
        this.menu.popup(window);
    }
}

exports.albumPopup = new AlbumPopup();
this.albumPopup.initMenu();