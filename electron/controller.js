const { SlideshowControl, Channel } = require("../shared/communication");

const IMG_EXT = [".JPG", ".PNG", ".GIF"];

const isImage = (file) => {
    if(file.stat.isFile()) {
        var extension = file.ext.toUpperCase();
        return IMG_EXT.includes(extension);
    } else {
        return false;
    }
};

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

    getFile(index) {
        return this.files[index];
    }

    setConfiguration(config) {
        this.config = config;
        this.sendConfiguration(this.webContents);
    }

    sendConfiguration(sender) {
        sender.send(Channel.CONFIGURE_SLIDESHOW, this.config);
    }

    reload() {
        this.webContents.reloadIgnoringCache();
    }

    changeScreenMode() { this.setFullScreenMode(!this.fullscreen); }

    setFullScreenMode(fullscreenMode) {
        this.fullscreen = fullscreenMode;
        this.mainWindow.setFullScreen(this.fullscreen);
        this.mainWindow.menuBarVisible = !this.fullscreen;
    }

    openDevTools() {
        this.webContents.openDevTools({ mode: "detach" });
    }

    startSlideShow() { this.webContents.send(Channel.CONTROL_SLIDESHOW, SlideshowControl.START_STOP); }

    gotoPreviousImage() { this.webContents.send(Channel.CONTROL_SLIDESHOW, SlideshowControl.PREVIOUS); }

    gotoNextImage() { this.webContents.send(Channel.CONTROL_SLIDESHOW, SlideshowControl.NEXT); }

};

exports.controller = new Controller();