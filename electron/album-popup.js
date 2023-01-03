const { Menu } = require("electron");

class AlbumPopup {
    constructor() {}

    initMenu() {
        this.menu = Menu.buildFromTemplate([
            { label: "Cover ändern", "click": () => this.#changeCover() }
        ]);
    }

    #changeCover() {
        console.log("change cover of ", this.album.name);
    }

    popup(options, window) {
        this.album = options.album;
        this.menu.popup(window);
    }
}

exports.albumPopup = new AlbumPopup();
this.albumPopup.initMenu();