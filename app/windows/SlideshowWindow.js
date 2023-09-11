const path = require('path');
const { saveWindowProperties, readWindowProperties } = require("../electron/configuration");
const { controller } = require("../electron/controller");
const { BrowserWindow, globalShortcut } = require('electron');

const createWindow = () => {
  const mainWindow = new BrowserWindow(readWindowProperties());
  mainWindow.loadFile(path.join("renderer", "pages", "slideshow.html"));
  controller.initialize(mainWindow);
  mainWindow.on("close", () => saveWindowProperties(mainWindow));
  globalShortcut.register("Esc", () => controller.setFullScreenMode(false));
};

exports.mainWindow = createWindow();