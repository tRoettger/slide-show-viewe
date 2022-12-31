const ALBUMS_DISPLAY = document.getElementById("albums");

class AlbumRenderer {
    constructor(display) {
        this.display = display;
        this.render = this.render.bind(this);
    }

    #clearDisplay() {
        while(this.display.firstChild) {
            this.display.removeChild(this.display.lastChild);
        }
    }

    #createAlbumElement(album) {
        var element = document.createElement("div");
        element.className = "album";
        element.appendChild(this.#createCover(album));
        element.appendChild(this.#createLabel(album));
        element.title = `Enth&auml;lt ${album.count} Bilder`;
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
}

exports.albumRenderer = new AlbumRenderer(ALBUMS_DISPLAY);