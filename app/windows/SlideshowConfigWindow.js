const path = require("path");
const { WindowInstanceWrapper } = require("./WindowInstanceWrapper");
const { windowConfigurer } = require("../services/WindowConfigurer");
const { AppWindow } = require("../model/AppWindow");

const DEFAULT_SETTINGS = { width: 340, height: 210 };

const wrapper = new WindowInstanceWrapper(() => {
    const window = windowConfigurer.create("slideshow-config", DEFAULT_SETTINGS, { autoHideMenuBar: true});
    window.loadFile(path.join(__dirname, "..", "renderer", "pages", "slide-show-config.html"));
    return window;
});

exports.slideshowConfigAppWindow = new AppWindow(wrapper.ifPresent, wrapper.getOrCreate, false, false);