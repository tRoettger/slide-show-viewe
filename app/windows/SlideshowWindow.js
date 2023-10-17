const path = require('path');
const { slideshowConfigAppWindow } = require('./SlideshowConfigWindow');
const { albumOverviewAppWindow } = require('./AlbumOverviewWindow');
const { windowConfigurer } = require('../services/WindowConfigurer');
const { albumSelectionAppWindow } = require('./Alb')
const { AppWindow } = require('../model/AppWindow');

const DEFAULT_SETTINGS = { width: 800, height: 600 };

const createWindow = () => {
  const mainWindow = windowConfigurer.create("slideshow-window", DEFAULT_SETTINGS);
  mainWindow.loadFile(path.join("app", "renderer", "pages", "slideshow.html"));
  mainWindow.on("close", () => {
    albumSelectionAppWindow.close();
    slideshowConfigAppWindow.close();
    albumOverviewAppWindow.close();
  });
  return mainWindow;
};

const mainWindow = createWindow();
exports.mainAppWindow = new AppWindow((task) => task(mainWindow), () => mainWindow, true, true);