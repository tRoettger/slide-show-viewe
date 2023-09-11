const { ipcMain, ipcRenderer } = require("electron");
const { getDefaultSlideShowConfigPath } = require("./windows/configuration");
const fs = require("fs");
const { SlideshowControl, WindowId, AlbumRequest } = require("../shared/communication");
const { fileService } = require("./services/FileService");
const { createConfig } = require("../shared/slide-show");

/**
 * Contains channels to provide the server with information.
 */
const InChannel = {
    APPLICATION_READY: "application-ready",
    CHANGE_ALBUM_ORDER: "change-album-order",
    CONFIGURATION_READY: "configuration-ready",
    GET_IMAGES: "get-images",
    FILTER_ALBUMS: "filter-albums",
    LOAD_ALBUM: "load-album",
    NOTIFY_ALBUM: "notify-album",
    NOTIFY_ALBUM_CHANGED: "notify-album-changed",
    NOTIFY_PAGE_INFO: "notify-page-info",
    REQUEST_ALBUMS: "request-albums",
    SHOW_ALBUM_POPUP: "show-album-popup",
    SAVE_CONFIG: "save-config",
    SAVE_CONFIG_AS: "save-config-as"
};

/**
 * Contains channels via which the server provides information.
 */
const OutChannel = {
    CONFIGURE_SLIDESHOW: "configure-slideshow",
    CONTROL_SLIDESHOW: "control-slideshow",
    OPEN_ALBUM: "open-album",
    PROVIDE_IMAGE: "provide-image"
};

exports.clientApi = {
    requestImages: (shouldLoad) => ipcRenderer.send(InChannel.GET_IMAGES, shouldLoad),
    subscribeImages: (onImage) => ipcRenderer.on(
        OutChannel.PROVIDE_IMAGE, 
        (event, imageContainer) => onImage(imageContainer)
    ),
    subscribeAlbum: (onAlbum) => ipcRenderer.on(
        OutChannel.OPEN_ALBUM,
        (event, album) => onAlbum(album)
    ),
    subscribeSlideshowControls: (onStartStop, onNext, onPrevious) => {
        const controlMap = new Map();
        controlMap.set(SlideshowControl.START_STOP, onStartStop);
        controlMap.set(SlideshowControl.NEXT, onNext);
        controlMap.set(SlideshowControl.PREVIOUS, onPrevious);
        ipcRenderer.on(
            OutChannel.CONTROL_SLIDESHOW,
            (event, control) => {
                const handler = controlMap.get(control);
                handler ??= (control) => console.error("Received unknown slideshow control: ", control);
                handler();
            }
        )
    },
    subscribeSlideshowConfiguration: (onConfig) => ipcRenderer.on(
        OutChannel.CONFIGURE_SLIDESHOW, 
        (event, config) => onConfig(config)
    ),
    notifySlideshowWindowReady: () => ipcRenderer.send(InChannel.APPLICATION_READY, WindowId.MAIN_WINDOW)
};

exports.clientConfigApi = {
    saveConfig: (viewDuration, transitionDuration, timingFunction) => ipcRenderer.send(
        InChannel.SAVE_CONFIG, 
        createConfig(viewDuration, transitionDuration, timingFunction)
    ),
    saveConfigAs: (viewDuration, transitionDuration, timingFunction) => ipcRenderer.send(
        InChannel.SAVE_CONFIG_AS, 
        createConfig(viewDuration, transitionDuration, timingFunction)
    ),
    notifyInitialized: () => ipcRenderer.send(InChannel.CONFIGURATION_READY, WindowId.CONFIGURATION_WINDOW)
};

exports.clientAlbumApi = {
    changeAlbumOrder: (order) => ipcRenderer.send(InChannel.CHANGE_ALBUM_ORDER, order),
    filterAlbums: (value) => ipcRenderer.send(
        InChannel.FILTER_ALBUMS, 
        { type: FilterType.NAME, value: value }
    ),
    loadAlbum: (folder) => ipcRenderer.send(InChannel.LOAD_ALBUM, folder),
    requestAlbums: (page) => ipcRenderer.send(InChannel.REQUEST_ALBUMS, AlbumRequest.page(page)),
    showAlbumPopup: (options) => ipcRenderer.send(InChannel.SHOW_ALBUM_POPUP, options),
    subscribeAlbum: (onAlbum) => ipcRenderer.on(OutChannel.NOTIFY_ALBUM, (event, album) => onAlbum(album)),
    subscribeAlbumChange: (onAlbum) => ipcRenderer.on(OutChannel.NOTIFY_ALBUM_CHANGED, (event, album) => onAlbum(album)),
    subscribePageInfo: (onPageInfo) => ipcRenderer.on(OutChannel.NOTIFY_PAGE_INFO, (event, pageInfo) => onPageInfo(pageInfo))
};

exports.serverApi = {
    registerController: (controller) => {
        
        ipcMain.on(InChannel.APPLICATION_READY, (event, windowId) => {
            fs.readFile(getDefaultSlideShowConfigPath(), { encoding: 'utf-8' }, (err, data) => {
                    if(err) {
                        console.log("Error occured while loading default slideshow configuration: ", err);
                    } else {
                        const cfg = JSON.parse(data);
                        controller.setConfiguration(cfg);
                        event.sender.send(OutChannel.CONFIGURE_SLIDESHOW, cfg);
                    }
                });
        });

        ipcMain.on(InChannel.CONFIGURATION_READY, (e, msg) => controller.sendConfiguration(e.sender));

        ipcMain.on(InChannel.SAVE_CONFIG, (event, arg) => {
            controller.setConfiguration(arg);
            event.sender.send(InChannel.SAVE_CONFIG, { successful: true });
            fileService.saveConfig(arg);
        });

        ipcMain.on(InChannel.SAVE_CONFIG_AS, (event, config) => {
            controller.setConfiguration(config);
            event.sender.send(InChannel.SAVE_CONFIG_AS, { successful: true });
            fileService.saveConfigAs(config);
        });

        ipcMain.on(InChannel.GET_IMAGES, (event, keys) => {
            for(var key of keys) {
                controller.provideFile(key);
            }
        });
        
        ipcMain.on(InChannel.LOAD_ALBUM, (event, folder) => {
            controller.openAlbum(fileService.loadFiles([folder]));
        });
        
    },
    registerSelector: (selector) => {
        ipcMain.on(InChannel.REQUEST_ALBUMS, (event, request) => {
            console.log("Received album request: ", request);
            if(request.type == AlbumRequestType.PAGE) {
                selector.loadPage(request.page);
            }
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