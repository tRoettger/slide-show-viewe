const { isImage } = require("../model/imageFileHelper");
const { configService } = require("./ConfigService");
const { slideshowPlayer } = require("./SlideshowPlayer");
const { transitionService } = require("./TransitionService");
const { Observable } = require("../model/Observable");

const ID = "slidshowService";

const listenerGroup = () => {
    const listeners = [];
    const execute = (execution = (l) => {}) => {
        for(let listener of listeners) {
            execution(listener);
        }
    };
    return {
        push: (listener) => listeners.push(listener),
        execute: execute,
        notify: (msg) => execute((listener) => listener(msg))
    };
}

class SlideshowService extends Observable {
    constructor() {
        super();
        this.files = [];
        this.running = false;
        this.slideshowListeners = {
            onOpenAlbum: listenerGroup(),
            onSlideshowConfig: listenerGroup(),
            onCurrentIndex: listenerGroup(),
            onStart: listenerGroup(),
            onStop: listenerGroup(),
            onPrevious: listenerGroup(),
            onNext: listenerGroup(),
            onImage: listenerGroup(),
            onAbortTransition: listenerGroup(),
            onTransition: listenerGroup(),
            onStateChange: listenerGroup()
        };

        this.openAlbum = this.openAlbum.bind(this);
        this.isRunning = this.isRunning.bind(this);
        this.toggleSlideShow = this.toggleSlideShow.bind(this);
        this.getImage = this.getImage.bind(this);
        this.gotoImage = this.gotoImage.bind(this);
        this.getAlbum = this.getAlbum.bind(this);
        this.getCurrentIndex = this.getCurrentIndex.bind(this);
        this.subscribeSlideshow = this.subscribeSlideshow.bind(this);

        this.#setCurrentIndex(0);
    }

    subscribeSlideshow(id, onGoto) {
        super.subscribeSlideshow(id, {onGoto: onGoto});
    }

    openAlbum(files) {
        this.#stopSlideShow();
        this.files = files.filter(isImage);
        this.#setCurrentIndex(0);
        this.slideshowListeners.onOpenAlbum.notify(this.getAlbum());
    }

    #setConfiguration(config) {
        this.config = config;
        this.slideshowListeners.onSlideshowConfig.notify(this.config);
    }

    #setState(running) {
        this.running = running;
        this.slideshowListeners.onStateChange.notify(running);
    }

    #setCurrentIndex(index) {
        this.current = index;
        this.slideshowListeners.onCurrentIndex.notify(this.current);
    }

    getConfiguration() {
        return this.config;
    }
    #startSlideShow() { 
        this.#setState(true);
        this.slideshowListeners.onStart.execute();
    }
    #stopSlideShow() {
        this.#setState(false);
        this.slideshowListeners.onStop.execute();
    }
    toggleSlideShow() {
        if(this.isRunning()) {
            this.#stopSlideShow();
        } else {
            this.#startSlideShow();
        }
    }
    #gotoPreviousImage() { 
        this.#setCurrentIndex(((this.current) == 0 ? this.#getCount() : this.current) - 1);
        this.slideshowListeners.onPrevious.notify(this.getImage(this.current));
    }
    #gotoNextImage() {
        this.#setCurrentIndex((this.current + 1) % this.#getCount());
        this.slideshowListeners.onNext.notify(this.getImage(this.current));
    }
    gotoImage(index) {
        this.#setCurrentIndex((index*1) % this.#getCount());
        const image = this.getImage(this.current);
        this.notify(l => l.onGoto(image));
    }

    #transition() {
        this.slideshowListeners.onTransition.notify(this.getImage(this.current));
    }

    isRunning() {
        return this.running;
    }

    getCurrentIndex() {
        return this.current;
    }
    
    provideFile(index) {
        this.slideshowListeners.onImage.notify(this.getImage(index));
    }

    getImage(index) {
        return {
            index: index, 
            image: this.files[index]
        };
    }

    #getCount() {
        return this.files ? this.files.length : 0;
    }

    getAlbum() {
        return {count: this.#getCount()};
    }

    subscribeSlideshow(
        onOpenAlbum = (album) => {},
        onSlideshowConfig = (config) => {},
        onCurrentIndex = (index) => {},
        onStart = () => {},
        onStop = () => {},
        onPrevious = (image) => {},
        onNext = (image) => {},
        onImage = (image) => {},
        onAbortTransition = () => {},
        onTransition = (image) => {},
        onStateChange = (running) => {}
    ) {
        const wrapper = {
            onOpenAlbum: onOpenAlbum,
            onSlideshowConfig: onSlideshowConfig,
            onCurrentIndex: onCurrentIndex,
            onStart: onStart,
            onStop: onStop,
            onPrevious: onPrevious,
            onNext: onNext,
            onImage: onImage,
            onAbortTransition: onAbortTransition,
            onTransition: onTransition,
            onStateChange: onStateChange
        };
        for(let key in this.slideshowListeners) {
            const listener = wrapper[key];
            if(listener) {
                this.slideshowListeners[key].push(listener);
            }
        }
    }

    subscribeToPlayer(player) {
        player.subscribe(ID, {
            start: () => this.#startSlideShow(),
            pause: () => this.#stopSlideShow(),
            next: () => this.#gotoNextImage(),
            previous: () => this.#gotoPreviousImage()
        });
    }

    linkToTransitionService(service) {
        service.subscribe(ID, {
            transition: () => this.#transition(),
            autoNext: () => this.#gotoNextImage(),
            autoPause: this.slideshowListeners.onAbortTransition.execute
        });
        this.subscribe("TransitionService", (image) => {
            if(slideshowPlayer.isRunning()) {
                transitionService.resetAutoplay();
            }
        });
    }

    subscribeToConfigService(service) {
        service.subscribe(ID, (config) => this.#setConfiguration(config));
    }
};

exports.slideshowService = new SlideshowService();
this.slideshowService.subscribeToConfigService(configService);
this.slideshowService.subscribeToPlayer(slideshowPlayer);
this.slideshowService.linkToTransitionService(transitionService);