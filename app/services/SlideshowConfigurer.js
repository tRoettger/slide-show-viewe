const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const DEFAULT_MAIN_WINDOW_PROPERTIES = { 
    width: 800, height: 600
};

const createFixProperties = () => ({
    webPreferences: {
        sandbox: false,
        preload: path.join(__dirname, "..", "preload.js")
    }
});

const getCfgPath = () => {
    var cfgPath = path.join(app.getPath("userData"), "./cfg");
    if(!fs.existsSync(cfgPath)) fs.mkdirSync(cfgPath);
    return cfgPath;
}

exports.getDefaultSlideShowConfigPath = () => path.join(getCfgPath(), "./default-slideshow.json");
exports.getWindowPropertiesPath = () => path.join(getCfgPath(), "./window-settings.json");

exports.saveWindowProperties = (window) => fs.writeFileSync(this.getWindowPropertiesPath(), JSON.stringify(window.getBounds()));

const readStoredProperties = () => {
    try {
        return JSON.parse(fs.readFileSync(this.getWindowPropertiesPath(), 'utf-8'));
    } catch (e) {
        console.log("Error while reading window settings, continuing with default properties: ", e);
        return {};
    }
};

exports.readWindowProperties = () => ({
    ...DEFAULT_MAIN_WINDOW_PROPERTIES,
    ...readStoredProperties(),
    ...createFixProperties()
});