const path = require("path");
const { WindowInstanceWrapper } = require("./WindowInstanceWrapper");
const { windowConfigurer } = require("../services/WindowConfigurer");
const { AppWindow } = require("../model/AppWindow");

const DEFAULT_SETTINGS = {
    width: 800, height: 600
};

const wrapper = new WindowInstanceWrapper(() => {
    const window = windowConfigurer.create("album-overview", DEFAULT_SETTINGS, {autoHideMenuBar: true});
    window.loadFile(path.join(__dirname, "..", "renderer", "pages", "album-overview", "album-overview.html"));
    return window;
});

exports.albumOverviewAppWindow = new AppWindow(wrapper.ifPresent, wrapper.getOrCreate, false, false);