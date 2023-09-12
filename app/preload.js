const { contextBridge } = require('electron');
const { api, configApi, albumApi } = require('./communication/clientApi');

contextBridge.exposeInMainWorld('api', api);
contextBridge.exposeInMainWorld('configApi', configApi);
contextBridge.exposeInMainWorld('albumApi', albumApi);