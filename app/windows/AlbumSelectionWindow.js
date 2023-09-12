const { BrowserWindow } = require("electron");
const path = require("path");
const { subscriptionService } = require("../services/SubscriptionService");
const { WindowId } = require("../model/WindowUtils");

const SELECTOR_WINDOW_PROPERTIES = {
    width: 1080, height: 720,
    webPreferences: { 
        sandbox: false,
        preload: path.join(__dirname, "..", "preload.js")
    },
    show: false,
    autoHideMenuBar: true
};

const createWindow = () => {
    const window = new BrowserWindow(SELECTOR_WINDOW_PROPERTIES);
    window.loadFile(path.join(__dirname, "..", "renderer", "pages", "selector", "view.html"));
    window.on('close', (e) => subscriptionService.unsubscribeAll(WindowId.ALBUM_SELECTION));
    return window;
};

let instance;

exports.getOrCreateAlbumSelectionWindow = () => {
    if(!instance || instance.isDestroyed()) {
        instance = createWindow();
    }
    return instance;
}