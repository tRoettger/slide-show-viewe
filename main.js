const { app, BrowserWindow } = require('electron');
const isDev = require("electron-is-dev");
const path = require('path');
const fs = require('fs');

const DEFAULT_WINDOW_PROPERTIES = { width: 800, height: 600 };

const getWindowPropertiesPath = () => path.join(app.getAppPath(), "window-settings.json");

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
  winProps.webPreferences = { nodeIntegration: true, contextIsolation: false };
  console.log(winProps);
  const mainWindow = new BrowserWindow(winProps);
  if(isDev) {
    applyDevSetup(mainWindow);
  } else {
    applyProductionSetup(mainWindow);
  }

  mainWindow.on("close", () => saveWindowProperties(mainWindow));
};

const applyDevSetup = (mainWindow) => {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools({ mode: "detach" });
};

const applyProductionSetup = (mainWindow) => {
    mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
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