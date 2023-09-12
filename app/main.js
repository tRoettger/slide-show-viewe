const { app, BrowserWindow } = require('electron');
const { serverApi } = require('./communication/serverApi');

serverApi.initialize();
const createWindow = () => {
  require('./menu');
  require('./windows/SlideshowWindow');
};

if(process.platform !== 'darwin') {
  app.on('window-all-closed', app.quit);
}

app.on('ready', createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});