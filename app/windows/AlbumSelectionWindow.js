const path = require("path");
const { WindowId } = require("../model/WindowUtils");
const { selector } = require("../services/AlbumSelector");
const { albumPopupMenu } = require("./AlbumPopupMenu");
const { WindowInstanceWrapper } = require("./WindowInstanceWrapper");
const { windowConfigurer } = require("../services/WindowConfigurer");
const { AppWindow } = require("../model/AppWindow");

const DEFAULT_SETTINGS = { width: 1080, height: 720 };

const wrapper = new WindowInstanceWrapper(() => {
    const window = windowConfigurer.create("album-selection", DEFAULT_SETTINGS, { autoHideMenuBar: true });
    window.loadFile(path.join(__dirname, "..", "renderer", "pages", "selector", "view.html"));
    window.on('close', (e) => selector.clear());
    return window;
});

exports.albumSelectionAppWindow = new AppWindow(wrapper.ifPresent, wrapper.getOrCreate, false, false);

albumPopupMenu.registerTo(this);