const { Observable } = require("../model/Observable");
const { configService } = require("./ConfigService");
const { slideshowPlayer } = require("./SlideshowPlayer");

const TRANSITION = listener => listener.transition();
const AUTO_NEXT = listener => listener.autoNext();
const PAUSE = listener => listener.autoPause();

class TransitionService extends Observable {
    constructor(transitionDuration, viewDuration) {
        super();
        this.transitionDuration = transitionDuration;
        this.viewDuration = viewDuration;
        this.clear = () => {};

        this.setViewDuration = this.setViewDuration.bind(this);
        this.setTransitionDuration = this.setTransitionDuration.bind(this);
        this.startAutoplay = this.startAutoplay.bind(this);
        this.stopAutoplay = this.stopAutoplay.bind(this);
        this.resetAutoplay = this.resetAutoplay.bind(this);
    }

    setTransitionDuration(transitionDuration) {
        this.transitionDuration = transitionDuration * 1000;
    }

    setViewDuration(viewDuration) {
        this.viewDuration = viewDuration * 1000;
    }

    startAutoplay() {
        const viewTimeout = setTimeout(() => {
            this.notify(TRANSITION);
            const transitionTimeout = setTimeout(() => {
                this.notify(AUTO_NEXT);
                this.startAutoplay();
            }, this.transitionDuration);
            this.clear = () => clearTimeout(transitionTimeout);
        }, this.viewDuration);
        this.clear = () => clearTimeout(viewTimeout);
    }

    stopAutoplay() {
        this.clear();
        this.notify(PAUSE);
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

const ID = "transitionService";

exports.transitionService = new TransitionService(0,0);
configService.subscribe(ID, config => {
    this.transitionService.setViewDuration(config.viewDuration);
    this.transitionService.setTransitionDuration(config.transitionDuration);
});
slideshowPlayer.subscribe(ID, {
    start: this.transitionService.startAutoplay,
    pause: this.transitionService.stopAutoplay,
    next: () => {
        if(slideshowPlayer.isRunning()){
            this.transitionService.resetAutoplay();
        }
    },
    previous: () => {
        if(slideshowPlayer.isRunning()) {
            this.transitionService.resetAutoplay();
        }
    }
});

const log = (msg) => (() => console.log(`TransitionService: ${msg}`));
/*this.transitionService.subscribe("self", {
    transition: log("transition"),
    autoNext: log("autoNext"),
    autoPause: log("autoPause")
});*/