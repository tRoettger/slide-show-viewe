const { ipcRenderer } = require("electron");
const { Channel } = require("../../shared/communication");
const { albumRenderer } = require("./album-renderer");

console.log("loaded script");
ipcRenderer.on(Channel.NOTIFY_ALBUMS, (event, albums) => {
    console.log("albums: ", albums);
    albumRenderer.render(albums);
});
