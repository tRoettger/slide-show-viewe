const { isImage } = require("../model/imageFileHelper");
const { serverApi } = require("../communication/serverApi");

class SlideshowController {
    constructor() {
        this.files = [];
        this.running = false;
        this.startSlideShow = this.startSlideShow.bind(this);
        this.stopSlideShow = this.stopSlideShow.bind(this);
        this.gotoPreviousImage = this.gotoPreviousImage.bind(this);
        this.gotoNextImage = this.gotoNextImage.bind(this);
        this.openAlbum = this.openAlbum.bind(this);
        this.isRunning = this.isRunning.bind(this);
    }

    openAlbum(files) {
        this.files = files.filter(isImage);
        serverApi.broadcastOpenAlbum({count: this.files.length});
    }

    setConfiguration(config) {
        this.config = config;
        serverApi.broadcastSlideshowConfig(this.config);
    }

    getConfiguration() {
        return this.config;
    }
    startSlideShow() { 
        this.running = true;
        serverApi.broadcastSlideshowStart();
    }
    stopSlideShow() {
        this.running = false;
        serverApi.broadcastSlideshowStop();
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

};

exports.slideshowController = new SlideshowController();
serverApi.registerController(this.slideshowController);