const CSS_ROOT = document.querySelector(":root").style;
const ROOT = document.getElementById("root");

class SlideshowRenderer {
    constructor(cssRoot, display) {
        this.cssRoot = cssRoot;
        this.display = display;
    }

    updateAnimation(config) {
        this.cssRoot.setProperty("--transition-duration", config.transitionDuration + "s");
        this.cssRoot.setProperty("--view-duration", config.viewDuration + "s");
        this.cssRoot.setProperty("--timing-function", config.timingFunction);
    }

    createImageElements() {
        var imageElements = [];
        for(var i = this.count - 1; i >= 0; i--) {
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
}

exports.slideshowRenderer = new SlideshowRenderer(CSS_ROOT, ROOT);