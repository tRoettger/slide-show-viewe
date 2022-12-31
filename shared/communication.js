exports.Channel = {
    APPLICATION_READY: "application-ready",
    CONFIGURE_SLIDESHOW: "configure-slideshow",
    CONFIGURATION_READY: "configuration-ready",
    CONTROL_SLIDESHOW: "control-slideshow",
    GET_IMAGES: "get-images",
    NOTIFY_ALBUM: "notify-album",
    NOTIFY_PAGE_INFO: "notify-page-info",
    OPEN_ALBUM: "open-album",
    PROVIDE_IMAGE: "provide-image",
    REQUEST_ALBUMS: "request-albums",
    SAVE_CONFIG: "save-config",
    SAVE_CONFIG_AS: "save-config-as"
};

exports.SlideshowControl = {
    START_STOP: "start-stop",
    NEXT: "next",
    PREVIOUS: "previous"
};

exports.WindowId = {
    CONFIGURATION_WINDOW: "configuration-window",
    MAIN_WINDOW: "main-window"
};

exports.AlbumRequestType = {
    PAGE: "page"
};

exports.AlbumRequest = {
    page: (page) => ({type: this.AlbumRequestType.PAGE, page: page})
};