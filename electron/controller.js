const fs = require("fs");
const { ipcMain } = require("electron");

const IMG_EXT = [".JPG", ".PNG", ".GIF"];

const isImage = (file) => {
    if(file.stat.isFile()) {
        var extension = file.ext.toUpperCase();
        return IMG_EXT.includes(extension);
    } else {
        return false;
    }
};

const replaceAndWrap = (arg) => {
    if (arg && typeof arg == "string") {
        var newArg = arg.replace(/\\\\/g, "\\\\\\\\");
        return "'" + newArg + "'";
    } else {
        return arg;
    }
}

class Controller {
    constructor() {
        this.fullscreen = false;
    }

    initialize(mainWindow) {
        this.mainWindow = mainWindow;
        this.webContents = mainWindow.webContents;
    }

    openAlbum(files) {
        files = files.filter(isImage);
        this.execute("openAlbum", files.length).then(res => {;
            for(var i = 0; i < files.length; i++) {
                const file = files[i];
                file.index = i;
                fs.readFile(file.path, (err, data) => {
                    var fileObject = file;
                    fileObject.data = data.toString('base64');
                    this.execute("showAlbumImage", JSON.stringify(fileObject));
                });
            }
        });
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

    execute(method, ...args) {
        args = args.map(replaceAndWrap);
        var command = method + "(" + args.join(", ") + ");";
        return this.webContents.executeJavaScript(command);
    }

    openDevTools() {
        this.webContents.openDevTools({ mode: "detach" });
    }
};

exports.controller = new Controller();