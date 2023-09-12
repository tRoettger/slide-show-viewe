const { isImage } = require("../model/imageFileHelper");
const { serverApi } = require("../communication/serverApi");

class Controller {
    constructor() {
        this.fullscreen = false;
        this.files = [];
        this.running = false;
        this.changeScreenMode = this.changeScreenMode.bind(this);
        this.openDevTools = this.openDevTools.bind(this);
        this.startSlideShow = this.startSlideShow.bind(this);
        this.gotoPreviousImage = this.gotoPreviousImage.bind(this);
        this.gotoNextImage = this.gotoNextImage.bind(this);
        this.setFullScreenMode = this.setFullScreenMode.bind(this);
        this.openAlbum = this.openAlbum.bind(this);
    }

    initialize(mainWindow) {
        this.mainWindow = mainWindow;
        this.webContents = mainWindow.webContents;
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

    reload() { this.webContents.reloadIgnoringCache(); }
    changeScreenMode() { this.setFullScreenMode(!this.fullscreen); }

    setFullScreenMode(fullscreenMode) {
        this.fullscreen = fullscreenMode;
        this.mainWindow.setFullScreen(this.fullscreen);
        this.mainWindow.menuBarVisible = !this.fullscreen;
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
    
    openDevTools() { this.webContents.openDevTools({ mode: "detach" }); }

};

exports.controller = new Controller();
serverApi.registerController(this.controller);