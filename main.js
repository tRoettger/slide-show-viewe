if (require('electron-squirrel-startup')) return;
const { app, BrowserWindow } = require('electron');
const devToolEnabled = require("electron-is-dev");
const { saveWindowProperties, readWindowProperties } = require("./electron/configuration");
const { controller } = require("./electron/controller");
require('./electron/menu');
require('./electron/listener');

const DEFAULT_WINDOW_PROPERTIES = { width: 800, height: 600 };

const createWindow = () => {
  var winProps = readWindowProperties() || DEFAULT_WINDOW_PROPERTIES;
  winProps.webPreferences = { fullscreenable: true, nodeIntegration: true, contextIsolation: false, webSecurity: false };
  const mainWindow = new BrowserWindow(winProps);
  mainWindow.loadFile("public/index.html");
  controller.initialize(mainWindow);
  mainWindow.on("close", () => saveWindowProperties(mainWindow));
};

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