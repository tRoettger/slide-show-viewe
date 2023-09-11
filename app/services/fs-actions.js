const { dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { controller } = require("./controller.js");
const { getDefaultSlideShowConfigPath } = require("./configuration.js");
const { ALBUM_PROPERTIES_FILE } = require("../../shared/constants.js");
const { IMAGE_FILTER } = require("../../shared/slide-show.js");

const JSON_FILTER = { name: "JavaScript Object Notation", extensions: [ "json" ] };

exports.openFolder = () => {
    dialog.showOpenDialog({ properties: [ 'openDirectory' ]})
        .then(result => this.loadFiles(result.filePaths))
        .then(controller.openAlbum);
};

exports.loadFiles = (folders) => {
    var files = [];
    for(var folder of folders) {
        for (var filename of fs.readdirSync(folder)) {
            files.push(this.parseFilePath(folder, filename));
        }
    }
    files.sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
    return files;
}

exports.parseFilePath = (folder, filename) => {
    var file = path.parse(filename);
    file.path = path.resolve(folder, filename);
    file.stat = fs.statSync(file.path);
    return file;
};

const saveConfigToFile = (config, filePath) => {
    fs.writeFile(filePath, JSON.stringify(config), (err) => {
        if(err) { console.log("Error while saving settings: ", err); }
    });
}

exports.saveConfigAs = (config) => {
    dialog.showSaveDialog({ filters: [ JSON_FILTER ] }).then(result => {
        if(!result.canceled) { saveConfigToFile(config, result.filePath); }
    })
};

exports.saveConfig = (config) => saveConfigToFile(config, getDefaultSlideShowConfigPath());

exports.loadConfig = () => {
    dialog.showOpenDialog({
        properties: [ 'openFile' ],
        filters: [ JSON_FILTER ]
    }).then(result => this.loadConfigFrom(result.filePaths[0]));
};

exports.loadConfigFrom = (path) => fs.readFile(path, readConfigFormFile);

const readConfigFormFile = (err, data) => {
    if(err) {
        console.log("Error while reading file: ", err);
    } else {
        var config = JSON.parse(data);
        controller.setConfiguration(config);
    }
};

const getAlbumCfgPath = (folder) => path.join(folder, ALBUM_PROPERTIES_FILE);

exports.loadAlbumProps = (folder) => {
    var cfgPath = getAlbumCfgPath(folder);
    if(fs.existsSync(cfgPath)) {
        var result = fs.readFileSync(cfgPath, { encoding: "utf-8" });
        return JSON.parse(result);
    }
};

exports.storeAlbumProps = (folder, props) => {
    var cfgPath = getAlbumCfgPath(folder);
    fs.writeFile(cfgPath, JSON.stringify(props), (err) => {
        if(err) { console.log("Error while saving album properties: ", err); }
    });
};

exports.selectImage = (dialogTitle, defaultPath) => {
    var options = { 
        properties: ['openFile'], 
        filters: [ IMAGE_FILTER ],
        title: dialogTitle
    };
    if(defaultPath) {
        options.defaultPath = defaultPath;
    }
    return dialog.showOpenDialog(options);
};