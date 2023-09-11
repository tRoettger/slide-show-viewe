const { ipcMain } = require("electron");
const { saveConfigAs, saveConfig, loadFiles } = require("./fs-actions");
const { getDefaultSlideShowConfigPath } = require("./configuration");
const fs = require("fs");

/**
 * Contains channels to provide the server with information.
 */
const InChannel = {
    APPLICATION_READY: "application-ready",
    CHANGE_ALBUM_ORDER: "change-album-order",
    CONFIGURE_SLIDESHOW: "configure-slideshow",
    CONFIGURATION_READY: "configuration-ready",
    CONTROL_SLIDESHOW: "control-slideshow",
    GET_IMAGES: "get-images",
    FILTER_ALBUMS: "filter-albums",
    LOAD_ALBUM: "load-album",
    NOTIFY_ALBUM: "notify-album",
    NOTIFY_ALBUM_CHANGED: "notify-album-changed",
    NOTIFY_PAGE_INFO: "notify-page-info",
    OPEN_ALBUM: "open-album",
    PROVIDE_IMAGE: "provide-image",
    REQUEST_ALBUMS: "request-albums",
    SHOW_ALBUM_POPUP: "show-album-popup"
};

/**
 * Contains channels via which the server provides information.
 */
const OutChannel = {
    SAVE_CONFIG: "save-config",
    SAVE_CONFIG_AS: "save-config-as",
};

exports.clientApi = {

};

exports.serverApi = {
    registerController: (controller) => {
        
        ipcMain.on(InChannel.APPLICATION_READY, msg => {
            fs.readFile(getDefaultSlideShowConfigPath(), { encoding: 'utf-8' }, (err, data) => {
                    if(err) {
                        console.log("Error occured while loading default slideshow configuration: ", err);
                    } else {
                        controller.setConfiguration(JSON.parse(data));
                    }
                });
        });

        ipcMain.on(InChannel.CONFIGURATION_READY, (e, msg) => controller.sendConfiguration(e.sender));

        ipcMain.on(InChannel.SAVE_CONFIG, (event, arg) => {
            controller.setConfiguration(arg);
            event.sender.send(OutChannel.SAVE_CONFIG, { successful: true });
            saveConfig(arg);
        });

        ipcMain.on(InChannel.SAVE_CONFIG_AS, (event, arg) => {
            controller.setConfiguration(arg);
            event.sender.send(OutChannel.SAVE_CONFIG_AS, { successful: true });
            saveConfigAs(arg);
        });

        ipcMain.on(InChannel.GET_IMAGES, (event, keys) => {
            for(var key of keys) {
                controller.provideFile(key);
            }
        });
    },
    registerSelector: (selector) => {
        ipcMain.on(InChannel.REQUEST_ALBUMS, (event, request) => {
            console.log("Received album request: ", request);
            if(request.type == AlbumRequestType.PAGE) {
                selector.loadPage(request.page);
            }
        });
        
        ipcMain.on(InChannel.LOAD_ALBUM, (event, folder) => {
            controller.openAlbum(loadFiles([folder]));
        });
        
        ipcMain.on(InChannel.FILTER_ALBUMS, (event, filter) => {
            selector.filterAlbums(filter);
        });
        
        ipcMain.on(InChannel.CHANGE_ALBUM_ORDER, (event, order) => {
            selector.sortAlbums(order);
        });
        
        ipcMain.on(InChannel.SHOW_ALBUM_POPUP, (event, options) => {
            selector.showAlbumPopup(options);
        })
    }
};