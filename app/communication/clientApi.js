const { ipcRenderer } = require("electron");
const { FilterType } = require("../model/AlbumUtils");
const { OutChannel, InChannel } = require("./Channel");
const { AlbumRequest } = require("./Message");
const { WindowId } = require("../model/WindowUtils");

const subscribe = (id, outChannel, callback) => {
    console.log("Subscribing: ", { id: id, outChannel: outChannel });
    ipcRenderer.on(outChannel, callback);
    ipcRenderer.send(InChannel.SUBSCRIBE, { id: id, outChannel: outChannel });
};

const request = (outChannel, callback, requestBody) => {
    ipcRenderer.once(outChannel, (event, response) => callback(response));
    ipcRenderer.send(InChannel.REQUEST, {outChannel: outChannel, body: requestBody});
}

const createConfig = (viewDuration, transitionDuration, timingFunction) => ({
    viewDuration: viewDuration, 
    transitionDuration: transitionDuration, 
    timingFunction: timingFunction
});

exports.api = {
    controlSlideshow: {
        start: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.START),
        stop: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.STOP),
        startOrStop: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.START_OR_STOP),
        next: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.NEXT),
        previous: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.PREVIOUS)
    },
    requestImages: (indicies, onImages) => request(OutChannel.RESPOND_IMAGES, onImages, indicies),
    triggerImagesBroadcast: (shouldLoad) => ipcRenderer.send(InChannel.GET_IMAGES, shouldLoad),
    subscribeImages: (id, onImage) => subscribe(id, OutChannel.PROVIDE_IMAGE, (event, imageContainer) => onImage(imageContainer)),
    subscribeAlbum: (id, onAlbum) => subscribe(id, OutChannel.OPEN_ALBUM, (event, album) => onAlbum(album)),
    subscribeSlideshowControls: (id, onStart, onStop, onNext, onPrevious) => {
        subscribe(id, OutChannel.CONTROL_SLIDESHOW.START, onStart);
        subscribe(id, OutChannel.CONTROL_SLIDESHOW.STOP, onStop);
        subscribe(id, OutChannel.CONTROL_SLIDESHOW.NEXT, onNext);
        subscribe(id, OutChannel.CONTROL_SLIDESHOW.PREVIOUS, onPrevious);
    },
    notifySlideshowWindowReady: () => ipcRenderer.send(InChannel.APPLICATION_READY, "main-window")
};

exports.configApi = {
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

exports.albumApi = {
    changeAlbumOrder: (order) => ipcRenderer.send(InChannel.CHANGE_ALBUM_ORDER, order),
    filterAlbums: (value) => ipcRenderer.send(
        InChannel.FILTER_ALBUMS, 
        { type: FilterType.NAME, value: value }
    ),
    loadAlbum: (folder) => ipcRenderer.send(InChannel.LOAD_ALBUM, folder),
    requestAlbums: (page) => ipcRenderer.send(InChannel.REQUEST_ALBUMS, AlbumRequest.page(page)),
    requestPageInfo: () => ipcRenderer.send(InChannel.REQUEST_PAGE_INFO),
    showAlbumPopup: (options) => ipcRenderer.send(InChannel.SHOW_ALBUM_POPUP, options),
    subscribeAlbum: (id, onAlbum) => subscribe(id, OutChannel.NOTIFY_ALBUM, (event, album) => onAlbum(album)),
    subscribeAlbumChange: (id, onAlbum) => subscribe(id, OutChannel.NOTIFY_ALBUM_CHANGED, (event, album) => onAlbum(album)),
    subscribePageInfo: (id, onPageInfo) => subscribe(id, OutChannel.NOTIFY_PAGE_INFO, (event, pageInfo) => onPageInfo(pageInfo))
};

exports.windowApi = {
    windowId: WindowId
};