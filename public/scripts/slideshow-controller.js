const { createConfig } = require("../../shared/slide-show.js");
const { slideshowRenderer } = require("./slideshow-renderer");
const { ipcRenderer } = require("electron");
const { Channel } = require("../../shared/communication.js");

const PRELOAD_IMAGES = 5;
const DEFAULT_CONFIG = createConfig(2, 5, "ease-in-out");

class SlideshowController {
    constructor(renderer) {
        this.preloadCount = 0;
        this.count = 0;
        this.current = 0;
        this.running = false;
        this.config = DEFAULT_CONFIG;
        this.loaded = [];
        this.renderer = renderer;
        this.showNext = this.showNext.bind(this);
        this.showPrevious = this.showPrevious.bind(this);
    }

    isLoaded(index) {
        return this.loaded.includes(index);
    }

    normalizeIndex(i) {
        return (i < 0) ? (i + this.count) : (i % this.count);
    }

    calculatePreloadIndices() {
        var shouldLoad = [this.current];
        var start = this.current - PRELOAD_IMAGES;
        var end = this.current + PRELOAD_IMAGES;
        for(var i = start; i <= end; i++) {
            var index = this.normalizeIndex(i);
            if(!shouldLoad.includes(index)) shouldLoad.push(index);
        }

        return shouldLoad.filter(index => !this.isLoaded(index));
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
        this.pause();
        this.current = 0;
        this.count = album.count;
        this.preloadCount = Math.min(album.count, PRELOAD_IMAGES);
        this.loaded = [];
        this.setup();
    }

    notifyImage(container) {
        this.loaded.push(container.index * 1);
        this.renderer.renderImage(container.image, container.index);
    }

    pause() {
        this.running = false;
        this.renderer.stopTransition();
    }

    preloadImages() {
        var shouldLoad = this.calculatePreloadIndices();
        if(shouldLoad.length > 0) {
            ipcRenderer.send(Channel.GET_IMAGES, shouldLoad);
        }
    }

    setup() {
        this.renderer.setup(this.count);
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