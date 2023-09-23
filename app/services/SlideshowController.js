const { isImage } = require("../model/imageFileHelper");
const { serverApi } = require("../communication/serverApi");

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
        this.getImage = this.getImage.bind(this);
        this.gotoImage = this.gotoImage.bind(this);
        this.getAlbum = this.getAlbum.bind(this);
        this.getCurrentIndex = this.getCurrentIndex.bind(this);
        this.#setCurrentIndex(0);
    }

    openAlbum(files) {
        this.stopSlideShow();
        this.files = files.filter(isImage);
        this.#setCurrentIndex(0);
        serverApi.broadcastOpenAlbum(this.getAlbum());
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

    #setCurrentIndex(index) {
        this.current = index;
        serverApi.broadcastCurrentIndex(this.current);
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
        this.#setCurrentIndex(((this.current) == 0 ? this.#getCount() : this.current) - 1);
        serverApi.broadcastSlideshowPrevious(this.getImage(this.current));
    }
    gotoNextImage() {
        this.#setCurrentIndex((this.current + 1) % this.#getCount());
        serverApi.broadcastSlideshowNext(this.getImage(this.current));
    }
    gotoImage(index) {
        this.#setCurrentIndex((index*1) % this.#getCount());
        const image = this.getImage(this.current);
        serverApi.broadcastSlideShowGoto(image);
    }

    transition() {
        serverApi.broadcastSlideShowTransition(this.getImage(this.current));
    }

    isRunning() {
        return this.running;
    }

    getCurrentIndex() {
        return this.current;
    }
    
    provideFile(index) {
        serverApi.broadcastImage(this.getImage(index));
    }

    getImage(index) {
        return {
            index: index, 
            image: this.files[index]
        };
    }

    #getCount() {
        return this.files ? this.files.length : 0;
    }

    getAlbum() {
        return {count: this.#getCount()};
    }

    subscribeState(listener) {
        this.stateListeners.push(listener);
    }

};

exports.slideshowController = new SlideshowController();
serverApi.registerController(this.slideshowController);