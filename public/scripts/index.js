const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
const ROOT = document.getElementById("root");

var slideshow = {
    count: 0, 
    current: 0, 
    running: false, 
    interval: setInterval(() => {}, 5000),
    config: {
        viewDuration: 1000,
        animationDuration: 1000
    }
};

const openAlbum = (imgCount) => {
    slideshow.count = imgCount;
    while(ROOT.firstChild != null) ROOT.removeChild(ROOT.lastChild);
    for(var i = 0; i < imgCount; i++) {
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
    var child = ROOT.firstChild;
    ROOT.removeChild(child);
    ROOT.appendChild(child);
};

const createTransition = () => {
    
}

const controlSlideshow = (e) => {
    if(slideshow.running) {
        slideshow.running = false;
        BTN_SLIDESHOW.innerHTML = "start";
        clearInterval(slideshow.interval);
    } else if(slideshow.count > 1) {
        slideshow.running = true;
        BTN_SLIDESHOW.innerHTML = "stop";
        var swapDuration = slideshow.config.viewDuration + slideshow.config.animationDuration;
        slideshow.interval = setInterval(() => swapInterval(), swapDuration);
        createTransition();
    } 
};

BTN_SLIDESHOW.addEventListener("click", controlSlideshow);