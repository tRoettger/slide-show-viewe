if (require('electron-squirrel-startup')) return;
const { app, BrowserWindow, globalShortcut } = require('electron');
const { saveWindowProperties, readWindowProperties } = require("./electron/configuration");
const { controller } = require("./electron/controller");
require('./electron/menu');
require('./electron/listener');

const createWindow = () => {
  var winProps = readWindowProperties();
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
  globalShortcut.register("Esc", () => controller.setFullScreenMode(false));
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(init);