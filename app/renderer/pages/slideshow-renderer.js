
const EMPTY_INTERVAL = setInterval(() => {}, 5000);
const BUTTON_STATES = {
    start: { text: "&#9655;", title: "Diashow starten" },
    pause: { text: "&#10073;&#10073;", title: "Diashow pausieren" }
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
    
    createTransition() {
        this.display.lastChild.style.animationName = "fade";
    }

    removeImageElements() { 
        while(this.display.firstChild != null) {
            this.display.removeChild(this.display.lastChild); 
        }
    };

    renderImage(image, index) {
        tryToDisplay("album-image-" + index, (element) => {
            element.src = image.path;
            element.alt = image.path;
        });
    }

    setup(count) {
        this.removeImageElements();
        this.addImageElements(count);
    }

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

    #setPlayButtonState(state) {
        this.playBtn.innerHTML = state.text;
        this.playBtn.title = state.title;
    }

    startTransition(swapDuration, onFinish) {
        this.#setPlayButtonState(BUTTON_STATES.pause);
        this.createTransition();
        this.interval = setInterval(() => this.swapInterval(onFinish), swapDuration * 1000);
    }

    stopTransition() {
        this.#setPlayButtonState(BUTTON_STATES.start);
        clearInterval(this.interval);
        if(this.display.firstChild) {
            this.display.lastChild.style.animationName = "none";
        }
    }

    swapInterval(onFinish) {
        onFinish();
        this.createTransition();
    };

    updateAnimation(config) {
        this.cssRoot.setProperty("--transition-duration", config.transitionDuration + "s");
        this.cssRoot.setProperty("--view-duration", config.viewDuration + "s");
        this.cssRoot.setProperty("--timing-function", config.timingFunction);
    }
}

const createRenderer = () => {
    const CSS_ROOT = document.querySelector(":root").style;
    const ROOT = document.getElementById("root");
    const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
    return new SlideshowRenderer(CSS_ROOT, ROOT, BTN_SLIDESHOW);
};