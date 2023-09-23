const path = require('path');
const configWindow = require('./SlideshowConfigWindow');
const selectionWindow = require('./AlbumSelectionWindow');
const { albumOverviewWindow } = require('./AlbumOverviewWindow');
const { windowConfigurer } = require('../services/WindowConfigurer');

const DEFAULT_SETTINGS = { width: 800, height: 600 };

const createWindow = () => {
  const mainWindow = windowConfigurer.create("slideshow-window", DEFAULT_SETTINGS);
  mainWindow.loadFile(path.join("app", "renderer", "pages", "slideshow.html"));
  mainWindow.on("close", () => {
    configWindow.ifPresent(window => window.close());
    selectionWindow.ifPresent(window => window.close());
    albumOverviewWindow.ifPresent(window => window.close());
  });
  return mainWindow;
};

exports.mainWindow = createWindow();