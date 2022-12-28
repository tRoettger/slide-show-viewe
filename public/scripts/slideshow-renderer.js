const CSS_ROOT = document.querySelector(":root").style;
const ROOT = document.getElementById("root");
const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
const EMPTY_INTERVAL = setInterval(() => {}, 5000);
const SYMBOL = {
    start: "&#9655;",
    pause: "&#10073;&#10073;"
};

const tryToDisplay = (id, setup) => {
    var element = document.getElementById(id);
    if(element) {
        setup(element);
    } else {
        // retry 100 ms later
        setTimeout(() => tryToDisplay(id, setup), 100);
    }
}

class SlideshowRenderer {
    constructor(cssRoot, display, playBtn) {
        this.cssRoot = cssRoot;
        this.display = display;
        this.playBtn = playBtn;
        this.interval = EMPTY_INTERVAL;
    }

    addImageElements(count) {
        this.createImageElements(count).forEach(c => this.display.appendChild(c));
    }

    updateAnimation(config) {
        this.cssRoot.setProperty("--transition-duration", config.transitionDuration + "s");
        this.cssRoot.setProperty("--view-duration", config.viewDuration + "s");
        this.cssRoot.setProperty("--timing-function", config.timingFunction);
    }

    createImageElements(count) {
        var imageElements = [];
        for(var i = count - 1; i >= 0; i--) {
            var image = document.createElement("img");
            image.id = "album-image-" + i;
            image.className = "album-image";
            
            var wrapper = document.createElement("div");
            wrapper.className = "album-image-wrapper";
            wrapper.appendChild(image);
            imageElements.push(wrapper);
        }
        return imageElements;
    };

    removeImageElements() { 
        while(this.display.firstChild != null) {
            this.display.removeChild(this.display.lastChild); 
        }
    };

    showNext() {
        var child = this.display.lastChild;
        child.style.animationName = "none";
        this.display.removeChild(child);
        this.display.insertBefore(child, this.display.firstChild);
    }

    showPrevious() {
        this.display.lastChild.style.animationName = "none";
        var child = this.display.firstChild;
        this.display.removeChild(child);
        this.display.appendChild(child);
    }
    
    createTransition() {
        this.display.lastChild.style.animationName = "fade";
    }
    setup(count) {
        this.removeImageElements();
        this.addImageElements(count);
    }

    startTransition(swapDuration, onFinish) {
        this.playBtn.innerHTML = SYMBOL.pause;
        this.interval = setInterval(() => this.swapInterval(onFinish), swapDuration * 1000);
    }

    swapInterval(onFinish) {
        onFinish();
        createTransition();
    };

    stopTransition() {
        this.playBtn.innerHTML =  SYMBOL.start;
        clearInterval(this.interval);
        if(this.display.firstChild) {
            this.display.lastChild.style.animationName = "none";
        }
    }

    renderImage(image, index) {
        tryToDisplay("album-image-" + index, (element) => {
            element.src = image.path;
            element.alt = image.path;
        });
    }
}

exports.slideshowRenderer = new SlideshowRenderer(CSS_ROOT, ROOT, BTN_SLIDESHOW);