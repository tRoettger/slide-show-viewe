/* ISOLATED to prevent other files to access those variables */
(() => {
    class SlideshowRenderer {
        constructor(cssRoot, display, preloadImages) {
            this.cssRoot = cssRoot;
            this.display = display;
            this.preloadImages = preloadImages;
            this.elements = [];
            this.current = 0;
            this.updateAnimation = this.updateAnimation.bind(this);
            this.renderImage = this.renderImage.bind(this);
            this.show = this.show.bind(this);
            this.abortTransition = this.abortTransition.bind(this);
        }

        #tryToDisplay(id, setup) {
            let element = document.getElementById(id);
            if(element) {
                setup(element);
            } else {
                // retry 100 ms later
                setTimeout(() => this.#tryToDisplay(id, setup), 100);
            }
        }

        addImageElements(count) {
            this.elements = this.#createImageElements(count);;

            /* Append in reversed order */
            const elementsToAppend = [...this.elements];
            while(elementsToAppend.length > 0) {
                this.display.appendChild(elementsToAppend.pop().element);
            }
        }

        #createImageElements(count) {
            var imageElements = [];
            for(var i = 0; i < count; i++) {
                var image = document.createElement("img");
                image.id = "album-image-" + i;
                image.className = "album-image";
                
                var wrapper = document.createElement("div");
                wrapper.className = "album-image-wrapper";
                wrapper.appendChild(image);
                imageElements.push({element: wrapper, loaded: false});
            }
            return imageElements;
        };

        transition() {
            console.log("renderer: transition");
            this.display.lastChild.style.animationName = "fade";
        }

        removeImageElements() { 
            while(this.display.firstChild != null) {
                this.display.removeChild(this.display.lastChild); 
            }
        };

        renderImage(image, index) {
            this.#tryToDisplay("album-image-" + index, (element) => {
                element.src = image.path;
                element.alt = image.path;
                this.elements[index].loaded = true;
            });
        }

        setup(count) {
            this.removeImageElements();
            this.addImageElements(count);
            this.current = 0;
        }

        showNext() {
            console.log("renderer: show next");
            this.abortTransition();
            var child = this.display.lastChild;
            this.display.removeChild(child);
            child.style.animationName = "none";
            this.display.insertBefore(child, this.display.firstChild);
            this.current = (this.current + 1) % this.elements.length;
            this.preload();
        }
        
        show(index) {
            console.log(`goto ${index} `);
            const target = this.elements[index];
            target.element.style.animationName = "none";
            const firstElement = this.display.firstChild;
            let sibling;
            while((sibling = target.element.nextSibling)) {
                this.display.removeChild(sibling);
                this.display.insertBefore(sibling, firstElement);
            }
            this.current = index;
            this.preload();
        }

        showPrevious() {
            this.abortTransition();
            var child = this.display.firstChild;
            this.display.removeChild(child);
            this.display.appendChild(child);
            this.current = ((this.current == 0) ? this.elements.length : this.current) - 1;
            this.preload();
        }

        #calculateDistance(a, b) {
            const regularDistance = Math.abs(a - b);
            return Math.min(regularDistance, this.elements.length - regularDistance);
        }

        #determinePreloadIndicies() {
            const indicies = [];
            for(let i = 0; i < this.elements.length; i++) {
                if(!(this.elements[i].loaded) && this.preloadImages > this.#calculateDistance(this.current, i)) {
                    indicies.push(i);
                }
            }
            return indicies;
        }

        preload() {
            api.requestImages(this.#determinePreloadIndicies(), (images) => {
                for(let imageContainer of images) {
                    this.renderImage(imageContainer.image, imageContainer.index);
                }
            });
        }

        updateAnimation(config) {
            console.log("Received config in renderer: ", config);
            this.cssRoot.setProperty("--transition-duration", config.transitionDuration + "s");
            this.cssRoot.setProperty("--view-duration", config.viewDuration + "s");
            this.cssRoot.setProperty("--timing-function", config.timingFunction);
        }

        abortTransition() {
            this.display.lastChild.style.animationName = "none";
        }
    }

    const PRELOAD_IMAGES = 3;

    const CSS_ROOT = document.querySelector(":root").style;
    const ROOT = document.getElementById("root");
    const ID = windowApi.windowId.SLIDESHOW + "_renderer";
    const renderer = new SlideshowRenderer(CSS_ROOT, ROOT, PRELOAD_IMAGES);

    configApi.subscribe(ID, (cfg) => renderer.updateAnimation(cfg));

    api.controlSlideshow.subscribeNext(ID, (img) => renderer.showNext());
    api.controlSlideshow.subscribePrevious(ID, (img) => renderer.showPrevious());
    api.controlSlideshow.subscribeTransition(ID, (img) => renderer.transition());
    api.controlSlideshow.subscribeGoto(ID, (img) => {
        console.log("Received goto ", img);
        renderer.show(img.index);
    });
    api.controlSlideshow.subscribeStop(ID, renderer.abortTransition);

    const handleAlbum = (album) => {
        renderer.setup(album.count);
        renderer.preload();
    };
    api.subscribeAlbum(ID, handleAlbum);
    api.requestAlbum(handleAlbum);

})();