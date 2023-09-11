const { app, BrowserWindow } = require('electron');
require('./menu');
require('./services/listener');

const createWindow = () => require('./windows/SlideshowWindow');

if(process.platform !== 'darwin') {
  app.on('window-all-closed', app.quit);
}

app.on('ready', createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});