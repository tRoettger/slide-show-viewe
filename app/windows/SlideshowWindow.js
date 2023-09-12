const path = require('path');
const { saveWindowProperties, readWindowProperties } = require("../services/SlideshowConfigurer");
const { BrowserWindow } = require('electron');

const createWindow = () => {
  const mainWindow = new BrowserWindow(readWindowProperties());
  mainWindow.loadFile(path.join("app", "renderer", "pages", "slideshow.html"));
  mainWindow.on("close", () => saveWindowProperties(mainWindow));
  return mainWindow;
};

exports.mainWindow = createWindow();