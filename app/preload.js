const { contextBridge } = require('electron');
const { api, configApi, albumApi, windowApi } = require('./communication/clientApi');

contextBridge.exposeInMainWorld('api', api);
contextBridge.exposeInMainWorld('configApi', configApi);
contextBridge.exposeInMainWorld('albumApi', albumApi);
contextBridge.exposeInMainWorld('windowApi', windowApi);