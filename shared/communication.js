exports.Channel = {
    APPLICATION_READY: "application-ready",
    CHANGE_ALBUM_ORDER: "change-album-order",
    CONFIGURE_SLIDESHOW: "configure-slideshow",
    CONFIGURATION_READY: "configuration-ready",
    CONTROL_SLIDESHOW: "control-slideshow",
    GET_IMAGES: "get-images",
    FILTER_ALBUMS: "filter-albums",
    LOAD_ALBUM: "load-album",
    NOTIFY_ALBUM: "notify-album",
    NOTIFY_COVER_CHANGED: "notify-cover-changed",
    NOTIFY_PAGE_INFO: "notify-page-info",
    OPEN_ALBUM: "open-album",
    PROVIDE_IMAGE: "provide-image",
    REQUEST_ALBUMS: "request-albums",
    SAVE_CONFIG: "save-config",
    SAVE_CONFIG_AS: "save-config-as",
    SHOW_ALBUM_POPUP: "show-album-popup"
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

exports.FilterType = {
    NAME: "name"
};

exports.AlbumSorter = {
    PATH_ASC: "path-asc",
    PATH_DESC: "path-desc",
    NAME_ASC: "name-asc",
    NAME_DESC: "name-desc",
    DATE_ASC: "date_asc",
    DATE_DESC: "date_desc",
    SIZE_ASC: "size_asc",
    SIZE_DESC: "size-desc"
};

exports.AlbumRequest = {
    page: (page) => ({type: this.AlbumRequestType.PAGE, page: page})
};