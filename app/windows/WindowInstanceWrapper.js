const DESTROYED_INSTANCE = {isDestroyed: () => true};

class WindowInstanceWrapper {
    constructor(createWindow) {
        this.createWindow = createWindow;
        this.instance = DESTROYED_INSTANCE;
        this.getOrCreate = this.getOrCreate.bind(this);
        this.ifPresent = this.ifPresent.bind(this);
    }

    getOrCreate() {
        if(this.instance.isDestroyed()) {
            this.instance = this.createWindow();
        }
        return this.instance;
    }

    ifPresent(task) {
        if(!this.instance.isDestroyed()) {
            task(this.instance);
        }
    }

}

exports.WindowInstanceWrapper;