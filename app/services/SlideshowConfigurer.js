const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const getCfgPath = () => {
    var cfgPath = path.join(app.getPath("userData"), "./cfg");
    if(!fs.existsSync(cfgPath)) fs.mkdirSync(cfgPath);
    return cfgPath;
}

exports.getDefaultSlideShowConfigPath = () => path.join(getCfgPath(), "./default-slideshow.json");
