const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
const BTN_NEXT = document.getElementById("next-btn");
const BTN_PREVIOUS = document.getElementById("previous-btn");

let slideshowController;

api.subscribeAlbum(album => {
    console.log("Received album: ", album);
    slideshowController.loadAlbum(album);
})

api.subscribeImages(imageContainer => {
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

api.subscribeSlideshowConfiguration((config) => {
    console.log("Received new config: ", config);
    slideshowController ??= createController(config, createRenderer());
    wrapWithStopAndStart(() => slideshowController.configure(config));
});

api.subscribeSlideshowControls(controlSlideshow, gotoNext, gotoPrevious);

api.notifySlideshowWindowReady();
