const { ipcMain } = require("electron");
const { getDefaultSlideShowConfigPath } = require("../services/SlideshowConfigurer");
const fs = require("fs");
const { fileService } = require("../services/FileService");
const { SubscriptionService } = require("../services/SubscriptionService");
const { OutChannel, InChannel } = require("./Channel");
const { AlbumRequestType } = require("./Message");
const { configService } = require("../services/ConfigService");
const { slideshowPlayer } = require("../services/SlideshowPlayer");
const { slideshowService } = require("../services/SlideshowService");

const ID = "serverAPI";

const subscriptionService = new SubscriptionService();
ipcMain.on(InChannel.UNSUBSCRIBE, (event, id) => subscriptionService.unsubscribeAll(id));

exports.serverApi = {

    initialize: () => ipcMain.on(InChannel.SUBSCRIBE, (event, subscription) => subscriptionService.subscribe(
        subscription.id, 
        subscription.outChannel, 
        event.sender
    )),

    broadcastAlbumNotification: (album) => subscriptionService.broadcast(OutChannel.NOTIFY_ALBUM, album),
    broadcastAlbumChange: (album) => subscriptionService.broadcast(OutChannel.NOTIFY_ALBUM_CHANGED, album),
    broadcastPageInfo: (pageInfo) => subscriptionService.broadcast(OutChannel.NOTIFY_PAGE_INFO, pageInfo),
    registerSelector: (selector) => {
        ipcMain.on(InChannel.REQUEST_ALBUMS, (event, request) => {
            if(request.type == AlbumRequestType.PAGE) {
                selector.loadPage(request.page);
            }
        });
        ipcMain.on(InChannel.REQUEST_PAGE_INFO, (event) => event.sender.send(
            OutChannel.NOTIFY_PAGE_INFO, 
            selector.getPageInfo()
        ));
        ipcMain.on(InChannel.CHANGE_ALBUM_ORDER, (event, order) => selector.sortAlbums(order));
        ipcMain.on(InChannel.FILTER_ALBUMS, (event, filter) => selector.filterAlbums(filter));
        ipcMain.on(InChannel.SHOW_ALBUM_POPUP, (event, options) => selector.showAlbumPopup(options))
    }
};

ipcMain.on(InChannel.APPLICATION_READY, (event, windowId) => {
    fs.readFile(getDefaultSlideShowConfigPath(), { encoding: 'utf-8' }, (err, data) => {
            if(err) {
                console.log("Error occured while loading default slideshow configuration: ", err);
                console.log("Using default configuration.");
                configService.setDefaultConfig();
            } else {
                const cfg = JSON.parse(data);
                console.log("Configuration loaded:", cfg);
                configService.setConfig(cfg);
            }
        });
});

ipcMain.on(InChannel.GET_SLIDESHOW_CONFIG, (event) => event.sender.send(
    OutChannel.CONFIGURE_SLIDESHOW, 
    slideshowService.getConfiguration()
));

ipcMain.on(InChannel.SAVE_CONFIG, (event, cfg) => {
    configService.setConfig(cfg);
    event.sender.send(InChannel.SAVE_CONFIG, { successful: true });
    fileService.saveConfig(cfg);
});

ipcMain.on(InChannel.SAVE_CONFIG_AS, (event, cfg) => {
    configService.setConfig(cfg);
    fileService.saveConfigAs(cfg);
    event.sender.send(InChannel.SAVE_CONFIG_AS, { successful: true });
});

ipcMain.on(InChannel.GET_IMAGES, (event, keys) => {
    for(var key of keys) {
        slideshowService.provideFile(key);
    }
});

const requestMap = new Map();
requestMap.set(OutChannel.RESPOND_IMAGES, (indicies) => indicies.map(slideshowService.getImage));
requestMap.set(OutChannel.RESPOND_ALBUM, slideshowService.getAlbum);
requestMap.set(OutChannel.CONTROL_SLIDESHOW.CURRENT_INDEX, slideshowService.getCurrentIndex);

ipcMain.on(InChannel.REQUEST, (event, request) => {
    const handler = requestMap.get(request.outChannel);
    handler ??= (body) => undefined;
    const response = handler(request.body);
    event.sender.send(request.outChannel, response);
});

ipcMain.on(InChannel.LOAD_ALBUM, (event, folder) => slideshowService.openAlbum(fileService.loadFiles([folder])));

ipcMain.on(InChannel.CONTROL_SLIDESHOW.START, slideshowPlayer.start);
ipcMain.on(InChannel.CONTROL_SLIDESHOW.PAUSE, slideshowPlayer.pause);
ipcMain.on(InChannel.CONTROL_SLIDESHOW.NEXT, slideshowPlayer.next);
ipcMain.on(InChannel.CONTROL_SLIDESHOW.PREVIOUS, slideshowPlayer.previous);
ipcMain.on(InChannel.CONTROL_SLIDESHOW.GOTO, (event, index) => slideshowService.gotoImage(index));

slideshowService.subscribe(ID, (image) => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.GOTO, image));
slideshowService.subscribeSlideshow(
    (album) => subscriptionService.broadcast(OutChannel.OPEN_ALBUM, album),
    (config) => subscriptionService.broadcast(OutChannel.CONFIGURE_SLIDESHOW, config),
    (currentIndex) => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.CURRENT_INDEX, currentIndex),
    () => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.START),
    () => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.STOP),
    (image) => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.PREVIOUS, image),
    (image) => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.NEXT, image),
    (imageContainer) => subscriptionService.broadcast(OutChannel.PROVIDE_IMAGE, imageContainer),
    () => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.ABORT_TRANSITION),
    (image) => subscriptionService.broadcast(OutChannel.CONTROL_SLIDESHOW.TRANSITION, image)
)