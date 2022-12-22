const { ipcMain, BrowserWindow } = require("electron");
const { controller } = require("./controller.js");
const { saveConfig } = require("./fs-actions.js");
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

ipcMain.on('save-config', (event, arg) => {
    controller.setConfiguration(arg);
    event.sender.send("save-config", { successful: true });
    saveConfig(arg);
});