class AlbumSelector {
    constructor() {
        this.openWindow = this.openWindow.bind(this);
        this.test = "my test";
    }

    openWindow() {
        console.log("Open selector window: ", this.test);
    }
}

exports.selector = new AlbumSelector();