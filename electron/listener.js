const { ipcMain } = require("electron");
const { controller } = require("./controller");
const { saveConfigAs, saveConfig } = require("./fs-actions");
const { getDefaultSlideShowConfigPath } = require("./configuration");
const fs = require("fs");

ipcMain.on("application-ready", msg => {
    fs.readFile(getDefaultSlideShowConfigPath(), { encoding: 'utf-8' }, (err, data) => {
        if(err) {
            console.log("Error occured while loading default slideshow configuration: ", err);
        } else {
            controller.setConfiguration(JSON.parse(data));
        }
    });
});

ipcMain.on("configuration-ready", (e, msg) => {
    controller.sendConfiguration(e.sender);
});

ipcMain.on('save-config', (event, arg) => {
    controller.setConfiguration(arg);
    event.sender.send("save-config", { successful: true });
    saveConfig(arg);
});

ipcMain.on("save-config-as", (event, arg) => {
    controller.setConfiguration(arg);
    event.sender.send("save-config-as", { successful: true });
    saveConfigAs(arg);
});

ipcMain.on("get-images", (event, keys) => {
    for(var key of keys) {
        event.sender.send("provide-image", {index: key, image: controller.getFile(key)});
    }
});