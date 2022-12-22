const { app, ipcMain, BrowserWindow } = require("electron");
const { controller } = require("./controller.js");
const { saveConfigAs: saveConfig } = require("./fs-actions.js");
const path = require("path");
const isDev = require("electron-is-dev");

const CONFIG_WINDOW_PROPERTIES = {
    width: 640, height: 480,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    autoHideMenuBar: true
};

var saveCallback = () => {};

exports.configureApp = () => {
    const configWindow = new BrowserWindow(CONFIG_WINDOW_PROPERTIES);
    configWindow.loadFile("public/slide-show-config.html");
    if(isDev) {
        configWindow.webContents.openDevTools({ mode: "detach" });
    }
};

exports.getDefaultSlideShowConfigPath = () => path.join(app.getAppPath(), "./cfg/default-slideshow.json");