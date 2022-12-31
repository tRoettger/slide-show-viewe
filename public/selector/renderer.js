const { ipcRenderer } = require("electron");
const { Channel } = require("../../shared/communication");
const { albumRenderer } = require("./album-renderer");
const { paginationRenderer } = require("./pagination-renderer");

ipcRenderer.on(Channel.NOTIFY_ALBUM, (event, album) => {
    console.log("album: ", album);
    albumRenderer.render(album);
});

ipcRenderer.on(Channel.NOTIFY_PAGE_INFO, (event, pageInfo) => {
    paginationRenderer.render(pageInfo);
}); 