const fs = require("fs");

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
    constructor() {}

    initialize(webContents) {
        this.webContents = webContents;
    }

    openAlbum(files) {
        files = files.filter(isImage);
        this.execute("openAlbum", files.length);
        for(var i = 0; i < files.length; i++) {
            const file = files[i];
            file.index = i;
            fs.readFile(file.path, (err, data) => {
                var imageData = data.toString('base64');
                this.execute("showAlbumImage", file.index, imageData);
            });
        }
    }

    reload() {
        this.webContents.reloadIgnoringCache();
    }

    execute(method, ...args) {
        args = args.map(arg => typeof arg == "string" ? "\"" + arg + "\"" : arg);
        var command = method + "(" + args.join(", ") + ");";
        //console.log("command: ", command);
        this.webContents.executeJavaScript(command);
    }
};

exports.controller = new Controller();