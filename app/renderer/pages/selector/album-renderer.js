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
        this.updateAlbum = this.updateAlbum.bind(this);
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
            albumApi.showAlbumPopup({
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

    render(album) {
        var element = this.#createAlbumElement(album);
        this.albums.set(album.folder, element);
        this.display.appendChild(element);
    }

    loadAlbum(album) {
        albumApi.loadAlbum(album.folder);
    }

    updateAlbum(album) {
        console.log("albums: ", this.albums);
        let old = this.albums.get(album.folder);
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

const createRenderer = (albumDisplay) => new AlbumRenderer(albumDisplay);