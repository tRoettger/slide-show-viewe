const { WindowId } = require("../model/WindowUtils");
const path = require("path");
const { subscriptionService } = require("../services/SubscriptionService");
const { WindowInstanceWrapper } = require("./WindowInstanceWrapper");
const { windowConfigurer } = require("../services/WindowConfigurer");

const DEFAULT_SETTINGS = { width: 340, height: 210 };

exports.slideshowConfigWindow = new WindowInstanceWrapper(() => {
    const window = windowConfigurer.create("slideshow-config", DEFAULT_SETTINGS, { autoHideMenuBar: true});
    window.loadFile(path.join(__dirname, "..", "renderer", "pages", "slide-show-config.html"));
    window.on('close', (e) => subscriptionService.unsubscribeAll(WindowId.SLIDESHOW_CONFIG));
    return window;
});