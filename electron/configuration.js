const { app, BrowserWindow } = require("electron");
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

exports.getDefaultSlideShowConfigPath = () => path.join(app.getPath("userData"), "./cfg/default-slideshow.json");
exports.getWindowPropertiesPath = () => path.join(app.getPath('userData'), "./cfg/window-settings.json");

exports.saveWindowProperties = (window) => fs.writeFileSync(getWindowPropertiesPath(), JSON.stringify(window.getBounds()));


exports.readWindowProperties = () => {
    try {
        return JSON.parse(fs.readFileSync(getWindowPropertiesPath(), 'utf-8'));
    } catch (e) {
        console.log("Error while reading window settings: ", e);
    }
};