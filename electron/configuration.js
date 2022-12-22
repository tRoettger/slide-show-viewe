const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

const CONFIG_WINDOW_PROPERTIES = {
    width: 640, height: 480,
    webPreferences: { nodeIntegration: false, contextIsolation: false },
    autoHideMenuBar: true
};

exports.configureApp = () => {
    const configWindow = new BrowserWindow(CONFIG_WINDOW_PROPERTIES);
    configWindow.loadFile("public/slide-show-config.html");
    if(isDev) {
        configWindow.webContents.openDevTools({ mode: "detach" });
    }
};