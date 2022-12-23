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
};

exports.controller = new Controller();