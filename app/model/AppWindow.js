const { globalShortcut } = require('electron');
const { mainWindow } = require("../windows/SlideshowWindow");

class AppWindow {
    constructor(browserWindow, fullscreenAllowed, menuBarVisible) {
        this.browserWindow = browserWindow;
        this.fullscreen = false;

        const setScreenMode = (fullscreenAllowed) ? (fullscreenMode) => {
            this.fullscreen = fullscreenMode;
            this.browserWindow.setFullScreen(this.fullscreen);
            
            /* Hides menubar if window is in fullscreen mode. */
            this.browserWindow.menuBarVisible = menuBarVisible && !this.fullscreen;
        } : (fullscreenMode) => {
            /* Allow to "reset" windowed mode for windows without fullscreen mode. */
            this.browserWindow.setFullScreen(false);
            this.browserWindow.menuBarVisible = menuBarVisible;
        };

        this.changeScreenMode = () => setScreenMode(!this.fullscreen);
        this.setWindowed = () => setScreenMode(false);
        this.openDevTools = () => this.webContents.openDevTools({ mode: "detach" });

        this.changeScreenMode = this.changeScreenMode.bind(this);
        this.setWindowed = this.setWindowed.bind(this);
        this.openDevTools = this.openDevTools.bind(this);
        this.reload = this.reload.bind(this);
    }

    reload() {
        if(this.browserWindow.webContents) {
            this.browserWindow.webContents.reloadIgnoringCache();
        }
    }
    
};

exports.mainAppWindow = new AppWindow(mainWindow);
globalShortcut.register("Esc", this.mainAppWindow.setWindowed);

exports.reloadAll = () => {
    this.mainAppWindow.reload();
};