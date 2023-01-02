const { ipcRenderer } = require("electron");

const ALBUMS_DISPLAY = document.getElementById("albums");

const DATE_OPTIONS = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};

class AlbumRenderer {
    constructor(display) {
        this.display = display;
        this.render = this.render.bind(this);
        this.openAlbum = this.loadAlbum.bind(this);
    }

    clearDisplay() {
        while(this.display.firstChild) {
            this.display.removeChild(this.display.lastChild);
        }
    }

    #createAlbumElement(album) {
        var element = document.createElement("div");
        element.className = "album";
        element.appendChild(this.#createCover(album));
        element.appendChild(this.#createLabel(album));
        element.title = album.folder + "\n" 
            + `Erstellt am ${album.created.toLocaleDateString('de-DE', DATE_OPTIONS)} ` + "\n"
            + `Enthält ${album.count} Bilder`;
        element.addEventListener("click", e => this.loadAlbum(album));
        return element;
    }

    #createCover(album) {
        var img = document.createElement("img");
        img.src = album.cover.path;
        img.alt = album.cover.path;
        return img;
    }

    #createLabel(album) {
        var label = document.createElement("label");
        label.appendChild(document.createTextNode(album.name));
        return label;
    }

    render(album) {
        this.display.appendChild(this.#createAlbumElement(album));
    }

    loadAlbum(album) {
        ipcRenderer.send(Channel.LOAD_ALBUM, album.folder);
    }
}

exports.albumRenderer = new AlbumRenderer(ALBUMS_DISPLAY);