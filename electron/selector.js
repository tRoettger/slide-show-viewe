const { BrowserWindow } = require("electron");

const SELECTOR_WINDOW_PROPERTIES = {
    width: 640, height: 480,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    autoHideMenuBar: true
};

class AlbumSelector {
    constructor() {
        this.openWindow = this.openWindow.bind(this);
        this.test = "my test";
    }

    openWindow() {
        this.window = new BrowserWindow(SELECTOR_WINDOW_PROPERTIES);
        this.window.loadFile("public/selector/view.html");
        console.log("Open selector window: ", this.test);
    }
}

exports.selector = new AlbumSelector();