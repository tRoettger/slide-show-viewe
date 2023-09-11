const { contextBridge } = require('electron');
const { clientApi, clientConfigApi, clientAlbumApi } = require('./api');

contextBridge.exposeInMainWorld('api', clientApi);
contextBridge.exposeInMainWorld('configApi', clientConfigApi);
contextBridge.exposeInMainWorld('albumApi', clientAlbumApi);