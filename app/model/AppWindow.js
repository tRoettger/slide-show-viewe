const { globalShortcut } = require('electron');
const { mainWindow } = require("../windows/SlideshowWindow");

class AppWindow {
    constructor(browserWindow, fullscreenAllowed, menuBarVisible) {
        this.browserWindow = browserWindow;
        this.fullscreen = false;
        this.fullscreenAllowed = fullscreenAllowed;
        this.menuBarVisible = menuBarVisible;

        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.setWindowed = this.setWindowed.bind(this);
        this.openDevTools = this.openDevTools.bind(this);
        this.reload = this.reload.bind(this);
    }

    #setScreenMode(fullscreen) {
        this.fullscreen = this.fullscreenAllowed && fullscreen;
        this.browserWindow.setFullScreen(this.fullscreen);
        
        /* Hides menubar if window is in fullscreen mode. */
        this.browserWindow.menuBarVisible = this.menuBarVisible && !this.fullscreen;

    }

    toggleFullscreen() {
        this.#setScreenMode(!this.fullscreen);
    }

    setWindowed() {
        this.#setScreenMode(false);
    }

    openDevTools() {
        this.browserWindow.webContents.openDevTools({ mode: "detach" });
    }

    reload() {
        if(this.browserWindow.webContents) {
            this.browserWindow.webContents.reloadIgnoringCache();
        }
    }
    
};

exports.mainAppWindow = new AppWindow(mainWindow, true, true);
globalShortcut.register("Esc", this.mainAppWindow.setWindowed);

exports.reloadAll = () => {
    this.mainAppWindow.reload();
};