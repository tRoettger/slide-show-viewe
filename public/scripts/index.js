const { Channel, SlideshowControl } = require("../shared/communication");
const { ipcRenderer } = require("electron");
const { WindowId } = require("../shared/communication");
const { slideshowController } = require("./scripts/slideshow-controller");
const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
const BTN_NEXT = document.getElementById("next-btn");
const BTN_PREVIOUS = document.getElementById("previous-btn");

ipcRenderer.on(Channel.OPEN_ALBUM, (event, album) => {
    console.log("Received album: ", album);
    slideshowController.loadAlbum(album);
});

ipcRenderer.on(Channel.PROVIDE_IMAGE, (event, imageContainer) => {
    console.log("Received image:", imageContainer);
    slideshowController.notifyImage(imageContainer);
});

const controlSlideshow = (e) => {
    if(slideshowController.isRunning()) {
        slideshowController.pause();
    } else if(slideshowController.getCount() > 1) {
        slideshowController.start();
    } 
};

const gotoNext = (e) => wrapWithStopAndStart(slideshowController.showNext);
const gotoPrevious = (e) => wrapWithStopAndStart(slideshowController.showPrevious);

const wrapWithStopAndStart = (stepping) => {
    if(slideshowController.isRunning()) {
        slideshowController.pause();
        stepping();
        slideshowController.start();
    } else {
        stepping();
    }
}

BTN_SLIDESHOW.addEventListener("click", controlSlideshow);
BTN_NEXT.addEventListener("click", gotoNext);
BTN_PREVIOUS.addEventListener("click", gotoPrevious);

ipcRenderer.on(Channel.CONFIGURE_SLIDESHOW, (e, arg) => {
    console.log("Received new config: ", arg);
    wrapWithStopAndStart(() => slideshowController.configure(arg));
});

const CONTROL_MAP = new Map();
CONTROL_MAP.set(SlideshowControl.START_STOP, controlSlideshow);
CONTROL_MAP.set(SlideshowControl.NEXT, gotoNext);
CONTROL_MAP.set(SlideshowControl.PREVIOUS, gotoPrevious);

ipcRenderer.on(Channel.CONTROL_SLIDESHOW, (event, control) => {
    var handler = CONTROL_MAP.get(control);
    if(handler) {
        handler();
    } else {
        console.log("Received unknown slideshow control: ", control)
    }
});

ipcRenderer.send(Channel.APPLICATION_READY, WindowId.MAIN_WINDOW);
