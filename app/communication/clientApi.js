const { ipcRenderer } = require("electron");
const { FilterType } = require("../model/AlbumUtils");
const { OutChannel, InChannel } = require("./Channel");
const { AlbumRequest } = require("./Message");
const { WindowId } = require("../model/WindowUtils");

const wrapCallback = (callback) => {
    let outerError = new Error("An error occured while executing the callback");
    return (param) => {
        try {
            callback(param);
        } catch(innerError) {
            let combinedError = new Error(innerError.message);
            combinedError.stack = outerError.stack + "\ncaused by: " + innerError.stack;
            throw combinedError;
        }

    };
}

const SUBSCRIPTIONS = new Map();

const subscribe = (id, outChannel, callback) => {
    console.log(`Listener "${id}" subscribes to channel "${outChannel}"`);
    if(!(callback instanceof Function)) {
        throw new Error(`Callback for channel ${outChannel} is not a function.`);
    }
    callback = wrapCallback(callback);
    const subscriptionId = `${id} ${outChannel}`;
    const oldListener = SUBSCRIPTIONS.delete(subscriptionId)
    if(oldListener) {
        ipcRenderer.removeListener(outChannel, oldListener);
    }
    const listener = (event, msg) => callback(msg);
    SUBSCRIPTIONS.set(subscriptionId, listener);
    ipcRenderer.addListener(outChannel, listener);
    ipcRenderer.send(InChannel.SUBSCRIBE, { id: id, outChannel: outChannel });   
};

const request = (outChannel, callback, requestBody) => {
    if(!(callback instanceof Function)) {
        throw new Error("Callback has to be a function");
    }
    callback = wrapCallback(callback);
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
        goto: (index) => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.GOTO, index),
        next: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.NEXT),
        pause: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.PAUSE),
        previous: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.PREVIOUS),
        start: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.START),
        transition: () => ipcRenderer.send(InChannel.CONTROL_SLIDESHOW.TRANSITION),
        subscribeNext: (id, onNext) => subscribe(id, OutChannel.CONTROL_SLIDESHOW.NEXT, onNext),
        subscribePrevious: (id, onPrevious) => subscribe(id, OutChannel.CONTROL_SLIDESHOW.PREVIOUS, onPrevious),
        subscribeTransition: (id, onTransition) => subscribe(id, OutChannel.CONTROL_SLIDESHOW.TRANSITION, onTransition),
        subscribeGoto: (id, onGoto) => subscribe(id, OutChannel.CONTROL_SLIDESHOW.GOTO, onGoto),
        subscribeStart: (id, onStart) => subscribe(id, OutChannel.CONTROL_SLIDESHOW.START, onStart),
        subscribeStop: (id, onStop) => subscribe(id, OutChannel.CONTROL_SLIDESHOW.STOP, onStop)
    },
    requestAlbum: (onAlbum) => request(OutChannel.RESPOND_ALBUM, onAlbum),
    requestImages: (indicies, onImages) => request(OutChannel.RESPOND_IMAGES, onImages, indicies),
    triggerImagesBroadcast: (shouldLoad) => ipcRenderer.send(InChannel.GET_IMAGES, shouldLoad),
    subscribeImages: (id, onImage) => subscribe(id, OutChannel.PROVIDE_IMAGE, onImage),
    subscribeAlbum: (id, onAlbum) => subscribe(id, OutChannel.OPEN_ALBUM, onAlbum),
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
    subscribe: (id, onConfig) => subscribe(id, OutChannel.CONFIGURE_SLIDESHOW, onConfig),
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
    subscribeAlbum: (id, onAlbum) => subscribe(id, OutChannel.NOTIFY_ALBUM, onAlbum),
    subscribeAlbumChange: (id, onAlbum) => subscribe(id, OutChannel.NOTIFY_ALBUM_CHANGED, onAlbum),
    subscribePageInfo: (id, onPageInfo) => subscribe(id, OutChannel.NOTIFY_PAGE_INFO, onPageInfo)
};

exports.windowApi = {
    windowId: WindowId
};