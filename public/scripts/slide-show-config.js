const { ipcRenderer } = require("electron");
const { createConfig } = require("./scripts/slide-show.js");
const FORM_CONFIG = document.getElementById("config-form");
const SELECT_TRANSITION = document.getElementById("transition-timing-function");
const INPUT_TRANSITION = document.getElementById("transition-duration");
const INPUT_VIEW = document.getElementById("view-duration");

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