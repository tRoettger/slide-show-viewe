const path = require('path');
const { slideshowConfigWindow } = require('./SlideshowConfigWindow');
const selectionWindow = require('./AlbumSelectionWindow');
const { albumOverviewWindow } = require('./AlbumOverviewWindow');
const { windowConfigurer } = require('../services/WindowConfigurer');
const { AppWindow } = require('../model/AppWindow');

const DEFAULT_SETTINGS = { width: 800, height: 600 };

const createWindow = () => {
  const mainWindow = windowConfigurer.create("slideshow-window", DEFAULT_SETTINGS);
  mainWindow.loadFile(path.join("app", "renderer", "pages", "slideshow.html"));
  mainWindow.on("close", () => {
    slideshowConfigWindow.ifPresent(window => window.close());
    selectionWindow.ifPresent(window => window.close());
    albumOverviewWindow.ifPresent(window => window.close());
  });
  return mainWindow;
};

exports.mainWindow = createWindow();
exports.mainAppWindow = new AppWindow((task) => task(mainWindow), () => mainWindow, true, true);