const { ipcMain } = require("electron");
const { getDefaultSlideShowConfigPath } = require("../windows/configuration");
const fs = require("fs");
const { fileService } = require("../services/FileService");
const { subscriptionService } = require("../services/SubscriptionService");
const { OutChannel, InChannel } = require("./Channel");
const { AlbumRequestType } = require("./Message");

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
        
        ipcMain.on(InChannel.LOAD_ALBUM, (event, folder) => controller.openAlbum(fileService.loadFiles([folder])));

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
        ipcMain.on(InChannel.CHANGE_ALBUM_ORDER, (event, order) => selector.sortAlbums(order));
        ipcMain.on(InChannel.FILTER_ALBUMS, (event, filter) => selector.filterAlbums(filter));
        ipcMain.on(InChannel.SHOW_ALBUM_POPUP, (event, options) => selector.showAlbumPopup(options))
    }
};