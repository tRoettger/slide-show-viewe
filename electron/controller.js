const { SLIDESHOW_CONTROL_CHANNEL, SlideshowControl } = require("../shared/communication");

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
    }

    initialize(mainWindow) {
        this.mainWindow = mainWindow;
        this.webContents = mainWindow.webContents;
    }

    openAlbum(files) {
        this.files = files.filter(isImage);
        this.webContents.send("open-album", {count: this.files.length});
    }

    getFile(index) {
        return this.files[index];
    }

    setConfiguration(config) {
        this.config = config;
        this.sendConfiguration(this.webContents);
    }

    sendConfiguration(sender) {
        sender.send("configure-slideshow", this.config);
    }

    reload() {
        this.webContents.reloadIgnoringCache();
    }

    changeScreenMode() {
        this.fullscreen = !(this.fullscreen);
        this.mainWindow.setFullScreen(this.fullscreen);
        this.mainWindow.menuBarVisible = !this.fullscreen;
    }

    openDevTools() {
        this.webContents.openDevTools({ mode: "detach" });
    }

    startSlideShow() {
        this.webContents.send(SLIDESHOW_CONTROL_CHANNEL, SlideshowControl.START_STOP);
    }

    gotoPreviousImage() {
        this.webContents.send(SLIDESHOW_CONTROL_CHANNEL, SlideshowControl.PREVIOUS);
    }

    gotoNextImage() {
        this.webContents.send(SLIDESHOW_CONTROL_CHANNEL, SlideshowControl.NEXT);
    }

};

exports.controller = new Controller();