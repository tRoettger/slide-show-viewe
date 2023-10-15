const { Observable } = require("../model/Observable");

const START = (listener) => listener.start();
const PAUSE = (listener) => listener.pause();
const NEXT = (listener) => listener.next();
const PREVIOUS = (listener) => listener.previous();

class SlideshowPlayer extends Observable {
    constructor() {
        super((listener) => (this.isRunning() ? START : PAUSE)(listener));
        this.running = false;

        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.toggle = this.toggle.bind(this);
        
        this.isRunning = this.isRunning.bind(this);
    }

    #setRunning(running, notification) {
        if(this.running != running) {
            this.running = running;
            this.notify(notification);
        }
    }

    toggle() {
        if(this.isRunning()) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        this.#setRunning(true, START);
    }

    pause() {
        this.#setRunning(false, PAUSE);
    }

    next() {
        this.notify(NEXT);
    }

    previous() {
        this.notify(PREVIOUS);
    }

    isRunning() {
        return this.running;
    }
}

const log = (msg, obj) => console.log(`SlideshowPlayer: ${msg}`);

exports.slideshowPlayer = new SlideshowPlayer();
this.slideshowPlayer.subscribe("self", {
    start: () => log("start"),
    pause: () => log("pause"),
    next: () => log("next"),
    previous: () => log("previous"),
});