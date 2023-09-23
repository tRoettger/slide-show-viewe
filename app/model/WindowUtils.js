const path = require('path');

exports.WindowId = {
    ALBUM_OVERVIEW: "album-overview-window",
    ALBUM_SELECTION: "album-selection-window",
    SLIDESHOW: "slideshow-window",
    SLIDESHOW_CONFIG: "slideshow-configuration-window"
};

exports.createSecurityProperties = () => ({
    webPreferences: {
        sandbox: false,
        preload: path.join(__dirname, "..", "preload.js")
    }
});