const { createConfig } = require("../shared/slide-show.js");
const { slideshowRenderer } = require("./scripts/slideshow-renderer");
const { ipcRenderer } = require("electron");
const { Channel } = require("../../shared/communication.js");

const PRELOAD_IMAGES = 5;
const DEFAULT_CONFIG = createConfig(2, 5, "ease-in-out");

class SlideshowController {
    constructor(renderer) {
        this.count = 0;
        this.current = 0;
        this.running = false;
        this.config = DEFAULT_CONFIG;
        this.loaded = [];
        this.renderer = renderer;
        this.showNext = this.showNext.bind(this);
    }

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

    configure(config) {
        this.config = config;
        this.renderer.updateAnimation(config);
    }

    getCount() {
        return this.count;
    }

    init() {
        this.renderer.updateAnimation(this.config);
    }

    isRunning() {
        return this.running;
    }

    loadAlbum(album) {
        this.current = 0;
        this.count = album.count;
        this.loaded = [];
    }

    notifyImage(container) {
        this.loaded.push(container.index * 1);
        this.renderer.renderImage(container.image, container.index);
    }

    pause() {
        slideshow.running = false;
        this.renderer.stopTransition();
    }

    preloadImages() {
        var shouldLoad = this.calculatePreloadIndices();
        if(shouldLoad.length > 0) {
            ipcRenderer.send(Channel.GET_IMAGES, shouldLoad);
        }
    }

    setup() {
        this.renderer.removeImageElements();
        this.renderer.addImageElements(this.count);
        ipcRenderer.send(Channel.GET_IMAGES, this.calculatePreloadIndices());
    }

    showNext() {
        this.current = (this.current + 1) % this.count;
        this.renderer.showNext();
        this.preloadImages();
    }

    showPrevious() {
        // "+ slideshow.count" covers the step from first to last image.
        this.current = (this.current + this.count - 1) % this.count;
        this.renderer.showPrevious();
        this.preloadImages();
    }

    start() {
        this.running = true;
        var swapDuration = this.config.viewDuration + this.config.transitionDuration;
        this.renderer.startTransition(swapDuration, this.showNext);
    }
}

exports.slideshowController = new SlideshowController(slideshowRenderer);
this.slideshowController.init();