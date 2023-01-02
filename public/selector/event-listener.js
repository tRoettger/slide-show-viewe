const { ipcRenderer } = require("electron");
const { Channel, FilterType } = require("../../shared/communication");
const { albumRenderer } = require("./album-renderer");

const FORM_FILTER = document.getElementById("filter-form");
const INPUT_FILTER = document.getElementById("filter-input");
const SELECT_ORDER = document.getElementById("order");
const BTN_CLEAR = document.getElementById("filter-input-clear-btn");

const requestFilteredAlbums = (value) => {
    albumRenderer.clearDisplay();
    ipcRenderer.send(Channel.FILTER_ALBUMS, {
        type: FilterType.NAME,
        value: value
    });
};

FORM_FILTER.addEventListener("submit", e => {
    e.preventDefault();
    requestFilteredAlbums(INPUT_FILTER.value);
});

BTN_CLEAR.addEventListener("click", e => {
    requestFilteredAlbums("");
});