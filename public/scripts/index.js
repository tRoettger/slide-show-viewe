const SYMBOL = {
    start: "&#9655;",
    pause: "&#10073;&#10073;"
};
const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
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
    config: {
        viewDuration: 2,
        transitionDuration: 10,
        timingFunction: "ease-in-out"
    }
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
        ROOT.appendChild(image);
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
        element.title = file.path;
    });
};

const swapInterval = () => {
    slideshow.current = (slideshow.current + 1) % slideshow.count;
    var child = ROOT.lastChild;
    child.style.animationName = "none";
    ROOT.removeChild(child);
    ROOT.insertBefore(child, ROOT.firstChild);
    createTransition();
};
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

BTN_SLIDESHOW.addEventListener("click", controlSlideshow);