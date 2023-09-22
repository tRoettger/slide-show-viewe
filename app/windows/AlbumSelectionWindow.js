const { BrowserWindow } = require("electron");
const path = require("path");
const { subscriptionService } = require("../services/SubscriptionService");
const { WindowId } = require("../model/WindowUtils");
const { selector } = require("../services/AlbumSelector");
const { albumPopupMenu } = require("./AlbumPopupMenu");

const SELECTOR_WINDOW_PROPERTIES = {
    width: 1080, height: 720,
    webPreferences: { 
        sandbox: false,
        preload: path.join(__dirname, "..", "preload.js")
    },
    show: false,
    autoHideMenuBar: true
};

const wrapper = new WindowInstanceWrapper(() => {
    const window = new BrowserWindow(SELECTOR_WINDOW_PROPERTIES);
    window.loadFile(path.join(__dirname, "..", "renderer", "pages", "selector", "view.html"));
    window.on('close', (e) => {
        subscriptionService.unsubscribeAll(WindowId.ALBUM_SELECTION);
        selector.clear();
    });
    return window;
});

exports.getOrCreateAlbumSelectionWindow = wrapper.getOrCreate;
exports.ifPresent = wrapper.ifPresent;

albumPopupMenu.registerTo(this);