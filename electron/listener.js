const { ipcMain } = require("electron");
const { controller } = require("./controller");
const { saveConfigAs, saveConfig } = require("./fs-actions");
const { getDefaultSlideShowConfigPath } = require("./configuration");
const fs = require("fs");
const { Channel } = require("../shared/communication");
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
    if(request.page) {
        selector.loadPage(request.page);
    }
});