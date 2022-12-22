const { ipcRenderer } = require("electron");
const { createConfig } = require("./scripts/slide-show.js");
const FORM_CONFIG = document.getElementById("config-form");
const SELECT_TRANSITION = document.getElementById("transition-timing-function");
const INPUT_TRANSITION = document.getElementById("transition-duration");
const INPUT_VIEW = document.getElementById("view-duration");
const BTN_SAVE_AS = document.getElementById("save-as-btn");

const getConfig = () => {
    return createConfig(
        INPUT_VIEW.value * 1,
        INPUT_TRANSITION.value * 1,
        SELECT_TRANSITION.value
    );
};

FORM_CONFIG.addEventListener("submit", (e) => {
    e.preventDefault();
    ipcRenderer.send("save-config", getConfig());
});

BTN_SAVE_AS.addEventListener("click", (e) => {
    ipcRenderer.send("save-config-as", getConfig());
});

ipcRenderer.send("configuration-ready", "Configuration window ready.");

ipcRenderer.on("configure-slideshow", (e, config) => {
    INPUT_VIEW.value = config.viewDuration;
    INPUT_TRANSITION.value = config.transitionDuration;
    SELECT_TRANSITION.value = config.timingFunction;
});