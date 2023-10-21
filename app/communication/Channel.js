/**
 * Contains channels to provide the server with information.
 */
exports.InChannel = {
    APPLICATION_READY: "application-ready",
    CHANGE_ALBUM_ORDER: "change-album-order",
    CONTROL_SLIDESHOW: {
        GOTO: "control-slideshow-goto",
        NEXT: "control-slideshow-next",
        PAUSE: "control-slideshow-pause",
        PREVIOUS: "control-slideshow-previous",
        START: "control-slideshow-start",
        TRANSITION: "control-slideshow-trans"
    },
    GET_IMAGES: "get-images",
    GET_SLIDESHOW_CONFIG: "get-slideshow-config",
    FILTER_ALBUMS: "filter-albums",
    LOAD_ALBUM: "load-album",
    REQUEST: "request",
    REQUEST_ALBUMS: "request-albums",
    REQUEST_PAGE_INFO: "request-page-info",
    SHOW_ALBUM_POPUP: "show-album-popup",
    SAVE_CONFIG: "save-config",
    SAVE_CONFIG_AS: "save-config-as",
    SUBSCRIBE: "subscribe",
    UNSUBSCRIBE: "unsubscribe"
};

/**
 * Contains channels via which the server provides information.
 */
exports.OutChannel = {
    CONFIGURE_SLIDESHOW: "configure-slideshow",
    CONTROL_SLIDESHOW: {
        ABORT_TRANSITION: "control-slideshow-abort-transition",
        GOTO: "control-slideshow-goto",
        NEXT: "control-slideshow-next",
        PREVIOUS: "control-slideshow-previous",
        START: "control-slideshow-start",
        STOP: "control-slideshow-stop",
        TRANSITION: "control-slideshow-transition",
        CURRENT_INDEX: "control-slideshow-current-index"
    },
    NOTIFY_ALBUM: "notify-album",
    NOTIFY_ALBUM_CHANGED: "notify-album-changed",
    NOTIFY_PAGE_INFO: "notify-page-info",
    OPEN_ALBUM: "open-album",
    PROVIDE_IMAGE: "provide-image",
    RESPOND_ALBUM: "respond-album",
    RESPOND_IMAGES: "respond-images"
};