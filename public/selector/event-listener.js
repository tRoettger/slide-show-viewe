const { ipcRenderer } = require("electron");
const { Channel, FilterType } = require("../../shared/communication");

const FORM_FILTER = document.getElementById("filter-form");
const INPUT_FILTER = document.getElementById("filter-input");
const SELECT_ORDER = document.getElementById("order");

FORM_FILTER.addEventListener("submit", e => {
    e.preventDefault();
    ipcRenderer.send(Channel.FILTER_ALBUMS, {
        type: FilterType.NAME,
        value: INPUT_FILTER.value
    });
});