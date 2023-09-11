const { ipcMain, ipcRenderer } = require("electron");
const { getDefaultSlideShowConfigPath } = require("./windows/configuration");
const fs = require("fs");
const { WindowId, AlbumRequest, AlbumRequestType } = require("../shared/communication");
const { fileService } = require("./services/FileService");
const { createConfig } = require("../shared/slide-show");
const { subscriptionService } = require("./services/SubscriptionService");

/**
 * Contains channels to provide the server with information.
 */
const InChannel = {
    APPLICATION_READY: "application-ready",
    CHANGE_ALBUM_ORDER: "change-album-order",
    CONTROL_SLIDESHOW: {
        START: "control-slideshow-start",
        START_OR_STOP: "control-slideshow-start-or-stop",
        STOP: "control-slideshow-stop",
        NEXT: "control-slideshow-next",
        PREVIOUS: "control-slideshow-previous"
    },
    GET_IMAGES: "get-images",
    GET_SLIDESHOW_CONFIG: "get-slideshow-config",
    FILTER_ALBUMS: "filter-albums",
    LOAD_ALBUM: "load-album",
    REQUEST_ALBUMS: "request-albums",
    SHOW_ALBUM_POPUP: "show-album-popup",
    SAVE_CONFIG: "save-config",
    SAVE_CONFIG_AS: "save-config-as",
    SUBSCRIBE: "subscribe"
};

/**
 * Contains channels via which the server provides information.
 */
const OutChannel = {
    CONFIGURE_SLIDESHOW: "configure-slideshow",
    CONTROL_SLIDESHOW: {
        START: "control-slideshow-start",
        STOP: "control-slideshow-stop",
        NEXT: "control-slideshow-next",
        PREVIOUS: "control-slideshow-previous"
    },
    NOTIFY_ALBUM: "notify-album",
    NOTIFY_ALBUM_CHANGED: "notify-album-changed",
    NOTIFY_PAGE_INFO: "notify-page-info",
    OPEN_ALBUM: "open-album",
    PROVIDE_IMAGE: "provide-image",
};

const subscribe = (id, outChannel, callback) => {
    console.log("Subscribing: ", { id: id, outChannel: outChannel });
    ipcRenderer.on(outChannel, callback);
    ipcRenderer.send(InChannel.SUBSCRIBE, { id: id, outChannel: outChannel });
}

exports.clientApi = {
    controlSlideshow: {
        start: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.START),
        stop: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.STOP),
        startOrStop: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.START_OR_STOP),
        next: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.NEXT),
        previous: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.PREVIOUS)
    },
    requestImages: (shouldLoad) => ipcRenderer.send(InChannel.GET_IMAGES, shouldLoad),
    subscribeImages: (id, onImage) => subscribe(id, OutChannel.PROVIDE_IMAGE, (event, imageContainer) => onImage(imageContainer)),
    subscribeAlbum: (id, onAlbum) => subscribe(id, OutChannel.OPEN_ALBUM, (event, album) => onAlbum(album)),
    subscribeSlideshowControls: (id, onStart, onStop, onNext, onPrevious) => {
        subscribe(id, OutChannel.CONTROL_SLIDESHOW.START, onStart);
        subscribe(id, OutChannel.CONTROL_SLIDESHOW.STOP, onStop);
        subscribe(id, OutChannel.CONTROL_SLIDESHOW.NEXT, onNext);
        subscribe(id, OutChannel.CONTROL_SLIDESHOW.PREVIOUS, onPrevious);
    },
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
    subscribe: (id, onConfig) => subscribe(id, OutChannel.CONFIGURE_SLIDESHOW, (event, config) => onConfig(config)),
    requestConfig: () => ipcRenderer.send(InChannel.GET_SLIDESHOW_CONFIG)
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
    subscribeAlbum: (id, onAlbum) => subscribe(id, OutChannel.NOTIFY_ALBUM, (event, album) => onAlbum(album)),
    subscribeAlbumChange: (id, onAlbum) => subscribe(id, OutChannel.NOTIFY_ALBUM_CHANGED, (event, album) => onAlbum(album)),
    subscribePageInfo: (id, onPageInfo) => subscribe(id, OutChannel.NOTIFY_PAGE_INFO, (event, pageInfo) => onPageInfo(pageInfo))
};

exports.serverApi = {

    initialize: () => ipcMain.on(InChannel.SUBSCRIBE, (event, subscription) => subscriptionService.subscribe(
        subscription.id, 
        subscription.outChannel, 
        event.sender
    )),

    broadcastAlbumNotification: (album) => subscriptionService.broadcast(OutChannel.NOTIFY_ALBUM, album),
    broadcastAlbumChange: (album) => subscriptionService.broadcast(OutChannel.NOTIFY_ALBUM_CHANGED, album),
    broadcastImage: (imageContainer) => subscriptionService.broadcast(OutChannel.PROVIDE_IMAGE, imageContainer),
    broadcastPageInfo: (pageInfo) => subscriptionService.broadcast(OutChannel.NOTIFY_PAGE_INFO, pageInfo),
    broadcastOpenAlbum: (album) => subscriptionService.broadcast(OutChannel.OPEN_ALBUM, album),
    broadcastSlideshowConfig: (config) => subscriptionService.broadcast(OutChannel.CONFIGURE_SLIDESHOW, config),
    broadcastSlideshowStart: () => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.START),
    broadcastSlideshowStop: () => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.STOP),
    broadcastSlideshowNext: () => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.NEXT),
    broadcastSlideshowPrevious: () => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.PREVIOUS),
    registerController: (controller) => {
        ipcMain.on(InChannel.APPLICATION_READY, (event, windowId) => {
            fs.readFile(getDefaultSlideShowConfigPath(), { encoding: 'utf-8' }, (err, data) => {
                    if(err) {
                        console.log("Error occured while loading default slideshow configuration: ", err);
                    } else {
                        const cfg = JSON.parse(data);
                        console.log("config loaded:", cfg);
                        controller.setConfiguration(cfg);
                    }
                });
        });

        ipcMain.on(InChannel.GET_SLIDESHOW_CONFIG, (event) => event.sender.send(
            OutChannel.CONFIGURE_SLIDESHOW, 
            controller.getConfiguration()
        ));

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

        ipcMain.on(InChannel.CONTROL_SLIDESHOW.START, (event) => controller.startSlideShow());
        ipcMain.on(InChannel.CONTROL_SLIDESHOW.START, (event) => {
            if(controller.isRunning()) {
                controller.stopSlideShow();
            } else {
                controller.startSlideShow();
            }
        });
        ipcMain.on(InChannel.CONTROL_SLIDESHOW.STOP, (event) => controller.stopSlideShow());
        ipcMain.on(InChannel.CONTROL_SLIDESHOW.NEXT, (event) => controller.gotoNextImage());
        ipcMain.on(InChannel.CONTROL_SLIDESHOW.PREVIOUS, (event) => controller.gotoPreviousImage());
        
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