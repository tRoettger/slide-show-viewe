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
            this.running = false;
            if(this.interval) {
                clearInterval(this.interval);
            }
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
            if(!this.isRunning()) {
                this.running = true;
                this.onPlay();
                let swapDuration = (this.config.viewDuration + this.config.transitionDuration) * 1000;
                console.log("Swap duration", swapDuration);
                this.remoteControl.transition();
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

    let controller;

    configApi.subscribe(ID, (config) => {
        if(controller) {
            controller.configure(config);
        } else {
            controller = new SlideshowController(config, api.controlSlideshow, onPause, onPlay);
    
            const controlSlideshow = (e) => {
                if(controller.isRunning()) {
                    api.controlSlideshow.pause();
                } else {
                    api.controlSlideshow.start();
                }
            };
    
            const startSlideShow = (e) => {
                if(controller.getCount() > 1) {
                    api.controlSlideshow.start();
                }
            };
    
            const wrapWithStopAndStart = (stepping) => {
                if(controller.isRunning()) {
                    controller.pause();
                    stepping();
                    controller.start();
                } else {
                    stepping();
                }
            }
    
            BTN_SLIDESHOW.addEventListener("click", controlSlideshow);
            BTN_NEXT.addEventListener("click", (e) => wrapWithStopAndStart(controller.showNext));
            BTN_PREVIOUS.addEventListener("click", (e) => wrapWithStopAndStart(controller.showPrevious));
    
            api.subscribeAlbum(ID, album => {
                console.log("Received album: ", album);
                controller.loadAlbum(album);
            });

            api.controlSlideshow.subscribeStart(ID, controller.start);
            api.controlSlideshow.subscribeStop(ID, controller.pause);
        }
    
    });
    
})();