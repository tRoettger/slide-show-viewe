const { ipcRenderer } = require("electron");
const { Channel } = require("../../shared/communication");

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
        this.albums = new Map();
    }

    clearDisplay() {
        this.albums.clear();
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
        element.addEventListener("contextmenu", e => {
            e.preventDefault();
            this.#showAlbumPopup({
                album: album,
                x: e.x,
                y: e.y
            });
        });
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

    #showAlbumPopup(options) {
        ipcRenderer.send(Channel.SHOW_ALBUM_POPUP, options);
    }

    render(album) {
        console.log("render: ", album);
        var element = this.#createAlbumElement(album);
        this.albums.set(album.folder, element);
        this.display.appendChild(element);
    }

    loadAlbum(album) {
        ipcRenderer.send(Channel.LOAD_ALBUM, album.folder);
    }

    updateAlbum(album) {
        var old = this.albums.get(album.folder);
        console.log("old: ", old);
        console.log("album: ", album);
        if(old) {
            var element = this.#createAlbumElement(album);
            this.albums.set(album.folder, element);
            this.display.insertBefore(element, old);
            this.display.removeChild(old);
        }
    }
}

exports.albumRenderer = new AlbumRenderer(ALBUMS_DISPLAY);