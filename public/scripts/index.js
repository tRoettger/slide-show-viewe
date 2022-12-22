const { createConfig } = require("./scripts/slide-show.js");
const { ipcRenderer } = require("electron");
const SYMBOL = {
    start: "&#9655;",
    pause: "&#10073;&#10073;"
};
const DEFAULT_CONFIG = createConfig(2, 5, "ease-in-out");
const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
const BTN_NEXT = document.getElementById("next-btn");
const BTN_PREVIOUS = document.getElementById("previous-btn");
const ROOT = document.getElementById("root");
const CSS_ROOT = document.querySelector(":root").style;

const updateAnimation = (config) => {
    CSS_ROOT.setProperty("--transition-duration", config.transitionDuration + "s");
    CSS_ROOT.setProperty("--view-duration", config.viewDuration + "s");
    CSS_ROOT.setProperty("--timing-function", config.timingFunction);
};

var slideshow = {
    count: 0, 
    current: 0, 
    running: false, 
    interval: setInterval(() => {}, 5000),
    config: DEFAULT_CONFIG
};
updateAnimation(slideshow.config);

const openAlbum = (imgCount) => {
    pauseSlideshow();
    slideshow.current = 0;
    slideshow.count = imgCount;
    while(ROOT.firstChild != null) ROOT.removeChild(ROOT.lastChild);
    for(var i = imgCount - 1; i >= 0; i--) {
        var image = document.createElement("img");
        image.id = "album-image-" + i;
        image.className = "album-image";
        
        var wrapper = document.createElement("div");
        wrapper.className = "album-image-wrapper";
        wrapper.appendChild(image);
        ROOT.appendChild(wrapper);
    }
};

const tryToDisplay = (id, setup) => {
    var element = document.getElementById(id);
    if(element) {
        setup(element);
    } else {
        setTimeout(() => tryToDisplay(id, setup), 100);
    }
}

const showAlbumImage = (fileObjectJson) => {
    var file = JSON.parse(fileObjectJson);
    tryToDisplay("album-image-" + file.index, (element) => {
        element.src = "data:image/jpg;base64," + file.data;
        element.alt = file.path;
    });
};

const swapInterval = () => {
    showNextImage();
    createTransition();
};

const showNextImage = () => {
    slideshow.current = (slideshow.current + 1) % slideshow.count;
    var child = ROOT.lastChild;
    child.style.animationName = "none";
    ROOT.removeChild(child);
    ROOT.insertBefore(child, ROOT.firstChild);
}

const showPrevious = () => {
    // "+ slideshow.count" covers the step from first to last image.
    slideshow.current = (slideshow.current + slideshow.count - 1) % slideshow.count;
    ROOT.lastChild.style.animationName = "none";
    var child = ROOT.firstChild;
    ROOT.removeChild(child);
    ROOT.appendChild(child);
}

const createTransition = () => {
    ROOT.lastChild.style.animationName = "fade";
}

const startSlideshow = () => {
    slideshow.running = true;
    BTN_SLIDESHOW.innerHTML = SYMBOL.pause;
    var swapDuration = slideshow.config.viewDuration + slideshow.config.transitionDuration;
    createTransition();
    slideshow.interval = setInterval(swapInterval, swapDuration * 1000);
}

const pauseSlideshow = () => {
    slideshow.running = false;
    BTN_SLIDESHOW.innerHTML =  SYMBOL.start;
    clearInterval(slideshow.interval);
    if(ROOT.firstChild) {
        var style = ROOT.lastChild.style;
        style.animationName = "none";
    }
}

const controlSlideshow = (e) => {
    if(slideshow.running) {
        pauseSlideshow();
    } else if(slideshow.count > 1) {
        startSlideshow();
    } 
};

const gotoNext = (e) => {
    wrapWithStopAndStart(showNextImage);
}

const gotoPrevious = (e) => {
    wrapWithStopAndStart(showPrevious);
}

const wrapWithStopAndStart = (stepping) => {
    if(slideshow.running) {
        pauseSlideshow();
        stepping();
        startSlideshow();
    } else {
        stepping();
    }
}

BTN_SLIDESHOW.addEventListener("click", controlSlideshow);
BTN_NEXT.addEventListener("click", gotoNext);
BTN_PREVIOUS.addEventListener("click", gotoPrevious);

ipcRenderer.on('configure-slideshow', (e, arg) => {
    console.log("Received new config: ", arg);
    wrapWithStopAndStart(() => {
        slideshow.config = arg;
        updateAnimation(arg);
    });
});