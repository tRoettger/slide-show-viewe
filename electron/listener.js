const { app, ipcMain } = require("electron");
const { controller } = require("./controller.js");
const fs = require("fs");
const path = require("path");

const getDefaultSlideShowConfigPath = () => path.join(app.getAppPath(), "./cfg/default-slideshow.json");

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