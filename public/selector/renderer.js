const { ipcRenderer } = require("electron");
const { Channel } = require("../../shared/communication");
const { albumRenderer } = require("./album-renderer");
const { paginationRenderer } = require("./pagination-renderer");
require("./event-listener")

ipcRenderer.on(Channel.NOTIFY_ALBUM, (event, album) => {
    albumRenderer.render(album);
});

ipcRenderer.on(Channel.NOTIFY_PAGE_INFO, (event, pageInfo) => {
    paginationRenderer.render(pageInfo);
});