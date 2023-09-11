const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
const BTN_NEXT = document.getElementById("next-btn");
const BTN_PREVIOUS = document.getElementById("previous-btn");

let slideshowController;

const ID = "slideshow-view";

api.subscribeAlbum(ID, album => {
    console.log("Received album: ", album);
    slideshowController.loadAlbum(album);
})

api.subscribeImages(ID, imageContainer => {
    console.log("Received image:", imageContainer);
    slideshowController.notifyImage(imageContainer);
});

const controlSlideshow = (e) => {
    if(slideshowController.isRunning()) {
        stopSlideShow(e);
    } else {
        startSlideShow(e);
    } 
};

const startSlideShow = (e) => {
    if(slideshowController.getCount() > 1) {
        slideshowController.start();
    }
};
const stopSlideShow = (e) => {
    slideshowController.pause();
}
const gotoNext = (e) => wrapWithStopAndStart(slideshowController.showNext);
const gotoPrevious = (e) => wrapWithStopAndStart(slideshowController.showPrevious);

const wrapWithStopAndStart = (stepping) => {
    if(slideshowController.isRunning()) {
        stopSlideShow();
        stepping();
        startSlideShow();
    } else {
        stepping();
    }
}

BTN_SLIDESHOW.addEventListener("click", controlSlideshow);
BTN_NEXT.addEventListener("click", gotoNext);
BTN_PREVIOUS.addEventListener("click", gotoPrevious);

configApi.subscribe(ID, (config) => {
    console.log("Received new config: ", config);
    slideshowController ??= createController(config, createRenderer());
    wrapWithStopAndStart(() => slideshowController.configure(config));
});

api.subscribeSlideshowControls(ID, startSlideShow, stopSlideShow, gotoNext, gotoPrevious);

api.notifySlideshowWindowReady();
