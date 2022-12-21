class Controller {
    constructor() {}

    initialize(webContents) {
        this.webContents = webContents;
    }

    openAlbum(files) {
        console.log("files: ", files);
    }
};

exports.controller = new Controller();