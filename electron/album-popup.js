const { Menu } = require("electron");
const { loadAlbumProps } = require("./fs-actions");

class AlbumPopup {
    constructor() {}

    initMenu() {
        this.menu = Menu.buildFromTemplate([
            { label: "Cover ändern", "click": () => this.#changeCover() }
        ]);
    }

    #changeCover() {
        var props = loadAlbumProps(this.album.folder);
        props ??= {};
        
        console.log("props: ", props);
    }

    popup(options, window) {
        this.album = options.album;
        this.menu.popup(window);
    }
}

exports.albumPopup = new AlbumPopup();
this.albumPopup.initMenu();