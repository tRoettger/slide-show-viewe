const path = require('path');
const { BrowserWindow } = require('electron');
const configWindow = require('./SlideshowConfigWindow');
const selectionWindow = require('./AlbumSelectionWindow');
const { albumOverviewWindow } = require('./AlbumOverviewWindow');
const { windowConfigurer } = require('../services/WindowConfigurer');
const { createSecurityProperties } = require('../model/WindowUtils');

const DEFAULT_SETTINGS = { 
  width: 800, height: 600
};
const { configure, store } = windowConfigurer.register("slideshow-window");

const createWindow = () => {
  const mainWindow = new BrowserWindow({...createSecurityProperties(), show: false});
  configure(mainWindow).then(() => mainWindow.show());
  mainWindow.loadFile(path.join("app", "renderer", "pages", "slideshow.html"));
  mainWindow.on("close", () => {
    store(mainWindow.getBounds())
      .then(() => console.log("Stored slideshow window settings successfully"))
      .catch((err) => console.error("An error occured while storing the slideshow window settings:", err));
    configWindow.ifPresent(window => window.close());
    selectionWindow.ifPresent(window => window.close());
    albumOverviewWindow.ifPresent(window => window.close());
  });
  return mainWindow;
};

exports.mainWindow = createWindow();