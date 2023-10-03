class Observable {

    /**
     * 
     * @param {(listener: any) => void} onSubscribe 
     */
    constructor(onSubscribe = ((listener) => {})) {
        this.listeners = new Map();
        this.onSubscribe = onSubscribe;

        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.notify = this.notify.bind(this);
    }

    /**
     * @see Observable#notify
     * 
     * @param {any} id 
     * @param {any} listener will be used in Observable.notify
     * @returns 
     */
    subscribe(id, listener) {
        let result = this.listeners.set(id, listener);
        this.onSubscribe(listener);
        return result;
    }

    unsubscribe(id) {
        return this.listeners.delete(id);
    }

    /**
     * @param {(listener: any) => void} notification 
     */
    notify(notification) {
        for(let listener of this.listeners.values()) {
            notification(listener);
        }
    }
}