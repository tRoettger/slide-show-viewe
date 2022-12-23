if (require('electron-squirrel-startup')) return;
const { app, BrowserWindow } = require('electron');
const devToolEnabled = require("electron-is-dev") || app.commandLine.hasSwitch("devTools");
const path = require('path');
const fs = require('fs');
const { controller } = require("./electron/controller.js");
require('./electron/menu.js');
require('./electron/listener.js');

const DEFAULT_WINDOW_PROPERTIES = { width: 800, height: 600 };

const getWindowPropertiesPath = () => path.join(app.getAppPath(), "./cfg/window-settings.json");

const readWindowProperties = () => {
  try {
    return JSON.parse(fs.readFileSync(getWindowPropertiesPath(), 'utf-8'));
  } catch (e) {
    console.log("Error while reading window settings: ", e);
  }
};

const saveWindowProperties = (window) => fs.writeFileSync(getWindowPropertiesPath(), JSON.stringify(window.getBounds()));

const createWindow = () => {
  var winProps = readWindowProperties() || DEFAULT_WINDOW_PROPERTIES;
  winProps.webPreferences = { fullscreenable: true, nodeIntegration: true, contextIsolation: false };
  console.log(winProps);
  const mainWindow = new BrowserWindow(winProps);
  mainWindow.loadFile("public/index.html");
  controller.initialize(mainWindow);
  if(devToolEnabled) {
    applyDevSetup(mainWindow);
  } else {
    applyProductionSetup(mainWindow);
  }

  mainWindow.on("close", () => saveWindowProperties(mainWindow));
};

const applyDevSetup = (mainWindow) => {
    mainWindow.webContents.openDevTools({ mode: "detach" });
};

const applyProductionSetup = (mainWindow) => {};

const init = () => {
  createWindow();
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(init);