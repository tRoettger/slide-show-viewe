const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
const ROOT = document.getElementById("root");
const CSS_ROOT = getComputedStyle(document.querySelector(":root"));

var slideshow = {
    count: 0, 
    current: 0, 
    running: false, 
    interval: setInterval(() => {}, 5000),
    config: {
        viewDuration: 1000,
        transitionDuration: 1000
    }
};

const openAlbum = (imgCount) => {
    slideshow.count = imgCount;
    while(ROOT.firstChild != null) ROOT.removeChild(ROOT.lastChild);
    for(var i = imgCount; i >= 0; i--) {
        var image = document.createElement("img");
        image.id = "album-image-" + i;
        image.className = "album-image";
        ROOT.appendChild(image);
    }
};

const showAlbumImage = (index, data) => {
    document.getElementById("album-image-" + index)
        .src = "data:image/jpg;base64," + data;
};

const swapInterval = () => {
    console.log("Swapping");
    slideshow.current = (slideshow.current + 1) % slideshow.count;
    var child = ROOT.lastChild;
    ROOT.removeChild(child);
    ROOT.insertBefore(child, ROOT.firstChild);
    createTransition();
};

const toCssDuration = (millis) => {
    var seconds = millis / 1000;
    return seconds + "s";
}

const createTransition = () => {
    var child = ROOT.lastChild;
    child.style.animationDelay = toCssDuration(slideshow.config.viewDuration);
    child.style.animationDuration = toCssDuration(slideshow.config.transitionDuration);
    child.style.animationName = "fade";
}

const controlSlideshow = (e) => {
    if(slideshow.running) {
        slideshow.running = false;
        BTN_SLIDESHOW.innerHTML = "start";
        clearInterval(slideshow.interval);
    } else if(slideshow.count > 1) {
        slideshow.running = true;
        BTN_SLIDESHOW.innerHTML = "stop";
        var swapDuration = slideshow.config.viewDuration + slideshow.config.transitionDuration;
        slideshow.interval = setInterval(swapInterval, swapDuration);
        createTransition();
    } 
};

BTN_SLIDESHOW.addEventListener("click", controlSlideshow);