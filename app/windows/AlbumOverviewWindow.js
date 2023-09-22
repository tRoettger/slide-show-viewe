const { BrowserWindow } = require("electron");
const path = require("path");
const { WindowId } = require("../model/WindowUtils");
const { subscriptionService } = require("../services/SubscriptionService");
const { WindowInstanceWrapper } = require("./WindowInstanceWrapper");

const ALBUM_OVERVIEW_PROPERTIES = {
    width: 800, height: 600,
    webPreferences: { 
        sandbox: false,
        preload: path.join(__dirname, "..", "preload.js")
    },
    autoHideMenuBar: true
};

exports.albumOverviewWindow = new WindowInstanceWrapper(() => {
    const window = new BrowserWindow(ALBUM_OVERVIEW_PROPERTIES);
    window.loadFile(path.join(__dirname, "..", "renderer", "pages", "album-overview", "album-overview.html"));
    window.on('close', (e) => {
        subscriptionService.unsubscribeAll(WindowId.ALBUM_OVERVIEW)
    });
    return window;
});