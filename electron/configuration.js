const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
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

const getCfgPath = () => {
    var cfgPath = path.join(app.getPath("userData"), "./cfg");
    if(!fs.existsSync(cfgPath)) fs.mkdirSync(cfgPath);
    return cfgPath;
}

exports.getDefaultSlideShowConfigPath = () => path.join(getCfgPath(), "./default-slideshow.json");
exports.getWindowPropertiesPath = () => path.join(getCfgPath(), "./window-settings.json");

exports.saveWindowProperties = (window) => fs.writeFileSync(this.getWindowPropertiesPath(), JSON.stringify(window.getBounds()));

exports.readWindowProperties = () => {
    try {
        return JSON.parse(fs.readFileSync(this.getWindowPropertiesPath(), 'utf-8'));
    } catch (e) {
        console.log("Error while reading window settings: ", e);
    }
};