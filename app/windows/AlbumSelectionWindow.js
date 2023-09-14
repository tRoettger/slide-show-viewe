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

const createWindow = () => {
    const window = new BrowserWindow(SELECTOR_WINDOW_PROPERTIES);
    window.loadFile(path.join(__dirname, "..", "renderer", "pages", "selector", "view.html"));
    window.on('close', (e) => {
        subscriptionService.unsubscribeAll(WindowId.ALBUM_SELECTION);
        selector.clear();
    });
    return window;
};

let instance;

const exists = (window) => window && !window.isDestroyed();

exports.getOrCreateAlbumSelectionWindow = () => {
    if(!exists(instance)) {
        instance = createWindow();
    }
    return instance;
};

exports.ifPresent = (task) => {
    if(exists(instance)) {
        task(instance);
    }
};

albumPopupMenu.registerTo(this);