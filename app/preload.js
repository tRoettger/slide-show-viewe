const { contextBridge } = require('electron');
const { clientApi } = require('./api');


contextBridge.exposeInMainWorld('api', clientApi);