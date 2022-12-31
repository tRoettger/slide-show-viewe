const { ipcRenderer } = require("electron");
const { Channel } = require("../../shared/communication");
const { albumRenderer } = require("./album-renderer");

console.log("loaded script");
ipcRenderer.on(Channel.NOTIFY_ALBUM, (event, album) => {
    console.log("album: ", album);
    albumRenderer.render(album);
});
