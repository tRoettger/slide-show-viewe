const { BrowserWindow } = require("electron");
const { WindowId } = require("../model/WindowUtils");
const path = require("path");
const { subscriptionService } = require("../services/SubscriptionService");

let instance;

const createConfigWindowProperties = () => ({
    width: 340, height: 210,
    webPreferences: { 
        sandbox: false,
        preload: path.join(__dirname, "..", "preload.js")
     },
    autoHideMenuBar: true
});

const createWindow = () => {
    const window = new BrowserWindow(createConfigWindowProperties());
    window.loadFile(path.join(__dirname, "..", "renderer", "pages", "slide-show-config.html"));
    window.on('close', (e) => subscriptionService.unsubscribeAll(WindowId.SLIDESHOW_CONFIG));
    return window;
};

exports.getOrCreateSlideshowConfigurationWindow = () => {
    if(!instance || instance.isDestroyed()) {
        instance = createWindow();
    }
    return instance;
}