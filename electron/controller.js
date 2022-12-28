const { SlideshowControl, Channel } = require("../shared/communication");

const IMG_EXT = [".JPG", ".PNG", ".GIF"];

const isImageExtension = (extension) => IMG_EXT.includes(extension.toUpperCase());
const isImage = (file) => file.stat.isFile() && isImageExtension(file.ext);

class Controller {
    constructor() {
        this.fullscreen = false;
        this.files = [];
        this.changeScreenMode = this.changeScreenMode.bind(this);
        this.openDevTools = this.openDevTools.bind(this);
        this.startSlideShow = this.startSlideShow.bind(this);
        this.gotoPreviousImage = this.gotoPreviousImage.bind(this);
        this.gotoNextImage = this.gotoNextImage.bind(this);
        this.setFullScreenMode = this.setFullScreenMode.bind(this);
    }

    initialize(mainWindow) {
        this.mainWindow = mainWindow;
        this.webContents = mainWindow.webContents;
    }

    openAlbum(files) {
        this.files = files.filter(isImage);
        this.webContents.send(Channel.OPEN_ALBUM, {count: this.files.length});
    }

    setConfiguration(config) {
        this.config = config;
        this.sendConfiguration(this.webContents);
    }

    sendConfiguration(sender) { sender.send(Channel.CONFIGURE_SLIDESHOW, this.config); }
    reload() { this.webContents.reloadIgnoringCache(); }
    changeScreenMode() { this.setFullScreenMode(!this.fullscreen); }

    setFullScreenMode(fullscreenMode) {
        this.fullscreen = fullscreenMode;
        this.mainWindow.setFullScreen(this.fullscreen);
        this.mainWindow.menuBarVisible = !this.fullscreen;
    }

    controlSlideShow(control) { this.webContents.send(Channel.CONTROL_SLIDESHOW, control); }
    startSlideShow() { this.controlSlideShow(SlideshowControl.START_STOP); }
    gotoPreviousImage() { this.controlSlideShow(SlideshowControl.PREVIOUS); }
    gotoNextImage() { this.controlSlideShow(SlideshowControl.NEXT); }
    getFile(index) { return this.files[index]; }
    
    openDevTools() { this.webContents.openDevTools({ mode: "detach" }); }

};

exports.controller = new Controller();