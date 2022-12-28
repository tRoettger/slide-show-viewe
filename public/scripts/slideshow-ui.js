const { createConfig } = require("../shared/slide-show.js");
const { slideshowRenderer } = require("./scripts/slideshow-renderer");

const EMPTY_INTERVAL = setInterval(() => {}, 5000);
const PRELOAD_IMAGES = 5;
const DEFAULT_CONFIG = createConfig(2, 5, "ease-in-out");

class Slideshow {
    constructor() {
        this.count = 0;
        this.current = 0;
        this.running = false;
        this.interval = EMPTY_INTERVAL;
        this.config = DEFAULT_CONFIG;
        this.loaded = [];
    }

    loadAlbum(album) {
        this.current = 0;
        this.count = album.count;
    }

    createImageElements() {
        var imageElements = [];
        for(var i = this.count - 1; i >= 0; i--) {
            var image = document.createElement("img");
            image.id = "album-image-" + i;
            image.className = "album-image";
            
            var wrapper = document.createElement("div");
            wrapper.className = "album-image-wrapper";
            wrapper.appendChild(image);
            imageElements.push(wrapper);
        }
        return imageElements;
    };

    calculatePreloadIndices() {
        var shouldLoad = [];
        var start = (this.current + this.count - PRELOAD_IMAGES) % this.count;
        var end = (this.current + PRELOAD_IMAGES) % this.count;
        // The less then does not work in this case.
        for(var i = start; i != end; i = (i + 1) % this.count) {
            if(!this.loaded.includes(i)) {
                shouldLoad.push(i);
            }
        }
        return shouldLoad;
    }
}

exports.slideshow = new Slideshow(slideshowRenderer);