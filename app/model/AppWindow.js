const selectionWindow = require('../windows/AlbumSelectionWindow');
const { slideshowConfigWindow } = require('../windows/SlideshowConfigWindow');
const { albumOverviewWindow } = require("../windows/AlbumOverviewWindow");

exports.AppWindow = class AppWindow {
    constructor(executor, getOrCreate, fullscreenAllowed, menuBarVisible) {
        this.fullscreen = false;
        this.fullscreenAllowed = fullscreenAllowed;
        this.menuBarVisible = menuBarVisible;
        this.executor = executor;
        this.getOrCreate = getOrCreate;

        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.setWindowed = this.setWindowed.bind(this);
        this.openDevTools = this.openDevTools.bind(this);
        this.reload = this.reload.bind(this);
        this.show = this.show.bind(this);
    }

    #processBrowserWindowTask(task) {
        return this.executor(task);
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
        this.getOrCreate().show();
    }

    close() {
        this.#processBrowserWindowTask(w => w.close());
    }

    focus() {
        this.#processBrowserWindowTask(w => w.focus());
    }

};

exports.albumSelectionAppWindow = new AppWindow((task) => selectionWindow.ifPresent(task), () => selectionWindow.getOrCreateAlbumSelectionWindow(), false, false);
exports.slideshowConfigAppWindow = new AppWindow((task) => slideshowConfigWindow.ifPresent(task), () => slideshowConfigWindow.getOrCreateSlideshowConfigurationWindow(), false, false);
exports.albumOverviewAppWindow = new AppWindow(albumOverviewWindow.ifPresent, albumOverviewWindow.getOrCreate, false, false);

exports.reloadAll = () => {
    for(let appWindow of [
        this.mainAppWindow,
        this.albumSelectionAppWindow,
        this.slideshowConfigAppWindow,
        this.albumOverviewAppWindow
    ]) {
        appWindow.reload();
    }
};