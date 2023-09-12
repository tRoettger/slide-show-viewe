const { globalShortcut } = require('electron');
const { mainWindow } = require("../windows/SlideshowWindow");
const { getOrCreateAlbumSelectionWindow } = require('../windows/AlbumSelectionWindow');
const { getOrCreateSlideshowConfigurationWindow } = require('../windows/SlideshowConfigWindow');

class AppWindow {
    constructor(browserWindowSupplier, fullscreenAllowed, menuBarVisible) {
        this.browserWindowSupplier = browserWindowSupplier;
        this.fullscreen = false;
        this.fullscreenAllowed = fullscreenAllowed;
        this.menuBarVisible = menuBarVisible;

        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.setWindowed = this.setWindowed.bind(this);
        this.openDevTools = this.openDevTools.bind(this);
        this.reload = this.reload.bind(this);
        this.show = this.show.bind(this);
    }

    #processBrowserWindowTask(task) {
        const browserWindow = this.browserWindowSupplier();
        return (browserWindow) ? task(browserWindow) : undefined;
    }

    #processWebcontentsTask(task) {
        return this.#processBrowserWindowTask(browserWindow => {
            const webContents = browserWindow.webContents;
            return (webContents) ? task(webContents) : undefined;
        });
    }

    #setScreenMode(fullscreen) {
        this.fullscreen = this.fullscreenAllowed && fullscreen;
        
        this.#processBrowserWindowTask(w => {
            w.setFullScreen(this.fullscreen)

            /* Hides menubar if window is in fullscreen mode. */
            w.menuBarVisible = this.menuBarVisible && !this.fullscreen;
        });
    }

    toggleFullscreen() {
        this.#setScreenMode(!this.fullscreen);
    }

    setWindowed() {
        this.#setScreenMode(false);
    }

    openDevTools() {
        this.#processWebcontentsTask(c => c.openDevTools({ mode: "detach" }));
    }

    reload() {
        this.#processWebcontentsTask(c => c.reloadIgnoringCache());
    }

    show() {
        this.#processBrowserWindowTask(w => w.show());
    }

};

exports.mainAppWindow = new AppWindow(() => mainWindow, true, true);
exports.albumSelectionAppWindow = new AppWindow(getOrCreateAlbumSelectionWindow, false, false);
exports.slideshowConfigAppWindow = new AppWindow(getOrCreateSlideshowConfigurationWindow, false, false);

globalShortcut.register("Esc", this.mainAppWindow.setWindowed);

exports.reloadAll = () => {
    for(let appWindow of [
        this.mainAppWindow,
        this.albumSelectionAppWindow,
        this.slideshowConfigAppWindow
    ]) {
        appWindow.reload();
    }
};