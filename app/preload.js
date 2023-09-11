const { contextBridge } = require('electron');
const { clientApi, clientConfigApi } = require('./api');

contextBridge.exposeInMainWorld('api', clientApi);
contextBridge.exposeInMainWorld('configApi', clientConfigApi);