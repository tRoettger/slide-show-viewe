/* ISOLATED to prevent other files to access those variables */
(() => {
    class SlideshowController {
        constructor(config, remoteControl, onPause, onPlay) {
            this.count = 0;
            this.running = false;
            this.config = config;
            this.remoteControl = remoteControl;
            this.onPause = onPause;
            this.onPlay = onPlay;

            this.showNext = this.showNext.bind(this);
            this.showPrevious = this.showPrevious.bind(this);
            this.start = this.start.bind(this);
            this.pause = this.pause.bind(this);
        }

        configure(config) {
            this.config = config;
        }

        getCount() {
            return this.count;
        }

        isRunning() {
            return this.running;
        }

        loadAlbum(album) {
            this.pause();
            this.count = album.count;
        }

        pause() {
            if(this.interval) {
                clearInterval(this.interval);
            }
            this.running = false;
            this.onPause();
        }

        showNext() {
            this.remoteControl.next();
        }

        showPrevious() {
            // "+ slideshow.count" covers the step from first to last image.
            this.remoteControl.previous();
        }

        start() {
            if(!this.isRunning() && this.getCount() > 1) {
                this.running = true;
                this.onPlay();
                const viewDuration = this.config.viewDuration * 1000;
                const transitionDuration = this.config.transitionDuration * 1000;
                const swapDuration = viewDuration + transitionDuration;
                console.log("Swap duration", swapDuration);

                setTimeout(() => {
                    this.remoteControl.transition();
                }, viewDuration);
                this.interval = setInterval(() => {
                    this.showNext();
                    this.remoteControl.transition();
                }, swapDuration);
            }
        }
    }

    const ID = windowApi.windowId.SLIDESHOW + "_controller";
    const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
    const BTN_NEXT = document.getElementById("next-btn");
    const BTN_PREVIOUS = document.getElementById("previous-btn");
    
    const onPause = () => {
        BTN_SLIDESHOW.innerHTML = "&#9655;";
        BTN_SLIDESHOW.title = "Diashow starten";
    };

    const onPlay = () => {
        BTN_SLIDESHOW.innerHTML =  "&#10073;&#10073;";
        BTN_SLIDESHOW.title = "Diashow pausieren";
    };
    
    const wrapWithStopAndStart = (stepping, controller) => {
        if(controller.isRunning()) {
            controller.pause();
            stepping();
            controller.start();
        } else {
            stepping();
        }
    };

    let controller;

    configApi.subscribe(ID, (config) => {
        if(controller) {
            console.log("controller received config", config);
            wrapWithStopAndStart(() => controller.configure(config), controller);
        } else {
            controller = new SlideshowController(config, api.controlSlideshow, onPause, onPlay);
    
            const controlSlideshow = (e) => {
                if(controller.isRunning()) {
                    api.controlSlideshow.pause();
                } else {
                    api.controlSlideshow.start();
                }
            };
    
            BTN_SLIDESHOW.addEventListener("click", controlSlideshow);
            BTN_NEXT.addEventListener("click", (e) => wrapWithStopAndStart(controller.showNext, controller));
            BTN_PREVIOUS.addEventListener("click", (e) => wrapWithStopAndStart(controller.showPrevious, controller));
    
            api.subscribeAlbum(ID, album => controller.loadAlbum(album));
            api.controlSlideshow.subscribeStart(ID, controller.start);
            api.controlSlideshow.subscribeStop(ID, controller.pause);
        }
    
    });
    
})();