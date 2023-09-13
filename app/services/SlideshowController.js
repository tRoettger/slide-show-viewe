const { isImage } = require("../model/imageFileHelper");
const { serverApi } = require("../communication/serverApi");
const { globalShortcut } = require("electron");

class SlideshowController {
    constructor() {
        this.files = [];
        this.running = false;
        this.stateListeners = [];
        this.startSlideShow = this.startSlideShow.bind(this);
        this.stopSlideShow = this.stopSlideShow.bind(this);
        this.gotoPreviousImage = this.gotoPreviousImage.bind(this);
        this.gotoNextImage = this.gotoNextImage.bind(this);
        this.openAlbum = this.openAlbum.bind(this);
        this.isRunning = this.isRunning.bind(this);
        this.toggleSlideShow = this.toggleSlideShow.bind(this);
    }

    openAlbum(files) {
        this.files = files.filter(isImage);
        serverApi.broadcastOpenAlbum({count: this.files.length});
    }

    setConfiguration(config) {
        this.config = config;
        serverApi.broadcastSlideshowConfig(this.config);
    }

    #setState(running) {
        this.running = running;
        for(let listener of this.stateListeners) {
            listener(running);
        }
    }

    getConfiguration() {
        return this.config;
    }
    startSlideShow() { 
        this.#setState(true);
        serverApi.broadcastSlideshowStart();
    }
    stopSlideShow() {
        this.#setState(false);
        serverApi.broadcastSlideshowStop();
    }
    toggleSlideShow() {
        if(this.isRunning()) {
            this.stopSlideShow();
        } else {
            this.startSlideShow();
        }
    }
    gotoPreviousImage() { 
        serverApi.broadcastSlideshowPrevious();
    }
    gotoNextImage() { 
        serverApi.broadcastSlideshowNext();
    }

    isRunning() {
        return this.running;
    }
    
    provideFile(index) {
        serverApi.broadcastImage({
            index: index, 
            image: this.files[index]
        });
    }

    subscribeState(listener) {
        this.stateListeners.push(listener);
    }

};

exports.slideshowController = new SlideshowController();
serverApi.registerController(this.slideshowController);