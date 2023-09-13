const path = require('path');
const { saveWindowProperties, readWindowProperties } = require("../services/SlideshowConfigurer");
const { BrowserWindow } = require('electron');
const configWindow = require('./SlideshowConfigWindow');
const selectionWindow = require('./AlbumSelectionWindow');

const createWindow = () => {
  const mainWindow = new BrowserWindow(readWindowProperties());
  mainWindow.loadFile(path.join("app", "renderer", "pages", "slideshow.html"));
  mainWindow.on("close", () => {
    saveWindowProperties(mainWindow);
    configWindow.ifPresent(window => window.close());
    selectionWindow.ifPresent(window => window.close());
  });
  return mainWindow;
};

exports.mainWindow = createWindow();