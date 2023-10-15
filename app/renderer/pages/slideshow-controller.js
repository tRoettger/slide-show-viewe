/* ISOLATED to prevent other files to access those variables */
(() => {
    class SlideshowController {
        constructor(config, remoteControl) {
            this.count = 0;
            this.running = false;
            this.config = config;
            this.remoteControl = remoteControl;

            this.showNext = this.showNext.bind(this);
            this.showPrevious = this.showPrevious.bind(this);
            this.start = this.start.bind(this);
            this.pause = this.pause.bind(this);
            this.toggle = this.toggle.bind(this);
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
            this.remoteControl.pause();
        }

        showNext() {
            this.remoteControl.next();
        }

        showPrevious() {
            this.remoteControl.previous();
        }

        start() {
            this.remoteControl.start();
        }

        toggle() {
            if(this.running) {
                this.pause();
            } else {
                this.start();
            }
        }

        setRunning(running) {
            this.running = running;
        }
    }

    const ID = windowApi.windowId.SLIDESHOW + "_controller";
    const BTN_SLIDESHOW = document.getElementById("slideshow-btn");
    const BTN_NEXT = document.getElementById("next-btn");
    const BTN_PREVIOUS = document.getElementById("previous-btn");
    
    let controller;

    configApi.subscribe(ID, (config) => {
        if(controller) {
            console.log("controller received config", config);
            controller.configure(config);
        } else {
            controller = new SlideshowController(config, api.controlSlideshow);
    
            BTN_SLIDESHOW.addEventListener("click", controller.toggle);
            BTN_NEXT.addEventListener("click", (e) => controller.showNext());
            BTN_PREVIOUS.addEventListener("click", (e) => controller.showPrevious());
    
            api.subscribeAlbum(ID, album => controller.loadAlbum(album));
            api.controlSlideshow.subscribeStart(ID, () => {
                controller.setRunning(true);
                BTN_SLIDESHOW.innerHTML =  "&#10073;&#10073;";
                BTN_SLIDESHOW.title = "Diashow pausieren";
            });
            api.controlSlideshow.subscribeStop(ID, () => {
                controller.setRunning(false);
                BTN_SLIDESHOW.innerHTML = "&#9655;";
                BTN_SLIDESHOW.title = "Diashow starten";
            });
        }
    
    });
    
})();