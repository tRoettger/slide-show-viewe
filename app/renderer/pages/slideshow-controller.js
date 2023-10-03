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
            this.transition = this.transition.bind(this);
            this.resetTransition = this.resetTransition.bind(this);
        }

        configure(config) {
            this.#pauseAndResumeFor(() => {
                this.config = config;
            });
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
            if(this.cancelSchedule) {
                console.log("cancel schedule: ", new Error("for stack"));
                this.cancelSchedule();
            }
            if(this.interval) {
                clearInterval(this.interval);
            }
            this.running = false;
            this.onPause();
        }

        showNext() {
            this.#pauseAndResumeFor(() => this.remoteControl.next());
        }

        showPrevious() {
            this.#pauseAndResumeFor(() => this.remoteControl.previous());
        }

        #schedule(task, timeout) {
            this.cancelSchedule = undefined;
            return new Promise((resolve, reject) => {
                this.cancelSchedule = undefined;
                let scheduledTimeout = setTimeout(() => {
                    try {
                        task();
                        this.cancelSchedule = undefined;
                        resolve();
                    } catch(err) {
                        console.error(err);
                        reject(err);
                    }
                }, timeout);
                this.cancelSchedule = () => {
                    clearTimeout(scheduledTimeout);
                    reject();
                };
            });
        }

        transition() {
            this.remoteControl.transition();
        }

        #transitionToNextImage() {
            const next = () => {
                console.log("controller: next after transition");
                this.remoteControl.next();
            };
            this.#schedule(this.transition, this.config.viewDuration * 1000)
                //.then(() => this.#schedule(next, this.config.transitionDuration * 1000))
                .then(() => this.#transitionToNextImage())
                .catch(err => {
                    if(err) {
                        console.error(err);
                    } else {
                        console.log("controller: transition canceled");
                    }
                });
        }

        start() {
            if(!this.isRunning() && this.getCount() > 1) {
                this.running = true;
                this.onPlay();

                this.#transitionToNextImage();
            }
        }

        #pauseAndResumeFor(task) {
            if(this.isRunning()) {
                this.pause();
                task();
                this.start();
            } else {
                task();
            }
        }

        resetTransition() {
            this.#pauseAndResumeFor(() => {});
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
            console.log("controller received config", config);
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
    
            BTN_SLIDESHOW.addEventListener("click", controlSlideshow);
            BTN_NEXT.addEventListener("click", (e) => controller.showNext());
            BTN_PREVIOUS.addEventListener("click", (e) => controller.showPrevious());
    
            api.subscribeAlbum(ID, album => controller.loadAlbum(album));
            api.controlSlideshow.subscribeStart(ID, controller.start);
            api.controlSlideshow.subscribeStop(ID, controller.pause);
            api.controlSlideshow.subscribeNext(ID, controller.resetTransition);
            api.controlSlideshow.subscribePrevious(ID, controller.resetTransition);
            api.controlSlideshow.subscribeGoto(ID, controller.resetTransition);
        }
    
    });
    
})();