const { ipcMain } = require("electron");
const { controller } = require("./controller");
const { saveConfigAs, saveConfig, loadFiles } = require("./fs-actions");
const { getDefaultSlideShowConfigPath } = require("./configuration");
const fs = require("fs");
const { Channel, AlbumRequestType } = require("../../shared/communication");
const { selector } = require("./selector");

ipcMain.on(Channel.APPLICATION_READY, msg => {
    fs.readFile(getDefaultSlideShowConfigPath(), { encoding: 'utf-8' }, (err, data) => {
        if(err) {
            console.log("Error occured while loading default slideshow configuration: ", err);
        } else {
            controller.setConfiguration(JSON.parse(data));
        }
    });
});

ipcMain.on(Channel.CONFIGURATION_READY, (e, msg) => {
    controller.sendConfiguration(e.sender);
});

ipcMain.on(Channel.SAVE_CONFIG, (event, arg) => {
    controller.setConfiguration(arg);
    event.sender.send(Channel.SAVE_CONFIG, { successful: true });
    saveConfig(arg);
});

ipcMain.on(Channel.SAVE_CONFIG_AS, (event, arg) => {
    controller.setConfiguration(arg);
    event.sender.send(Channel.SAVE_CONFIG_AS, { successful: true });
    saveConfigAs(arg);
});

ipcMain.on(Channel.GET_IMAGES, (event, keys) => {
    for(var key of keys) {
        controller.provideFile(key);
    }
});

ipcMain.on(Channel.REQUEST_ALBUMS, (event, request) => {
    console.log("Received album request: ", request);
    if(request.type == AlbumRequestType.PAGE) {
        selector.loadPage(request.page);
    }
});

ipcMain.on(Channel.LOAD_ALBUM, (event, folder) => {
    controller.openAlbum(loadFiles([folder]));
});

ipcMain.on(Channel.FILTER_ALBUMS, (event, filter) => {
    selector.filterAlbums(filter);
});

ipcMain.on(Channel.CHANGE_ALBUM_ORDER, (event, order) => {
    selector.sortAlbums(order);
});

ipcMain.on(Channel.SHOW_ALBUM_POPUP, (event, options) => {
    selector.showAlbumPopup(options);
})