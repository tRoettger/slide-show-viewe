const { createConfig } = require("./slide-show.js");
const FORM_CONFIG = document.getElementById("config-form");
const SELECT_TRANSITION = document.getElementById("transition-timing-function");
const INPUT_TRANSITION = document.getElementById("transition-duration");
const INPUT_VIEW = document.getElementById("view-duration");
const { ipcRenderer } = require("electron");

const getConfig = () => {
    return {
        viewDuration: 
    };
};

FORM_CONFIG.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("event: ", e);
    ipcRenderer.send("save-config", getConfig());
});