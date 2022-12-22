const { dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { controller } = require("./controller.js");

const JSON_FILTER = { name: "JavaScript Object Notation", extensions: [ "json" ] };

exports.openFolder = (onError) => {
    dialog.showOpenDialog({
        properties: [ 'openDirectory' ]
    }).then(result => {
        controller.openAlbum(loadFiles(result.filePaths, onError));
    });
};

const loadFiles = (folders, onError) => {
    var files = [];
    for(var folder of folders) {
        for (var filename of fs.readdirSync(folder)) {
            var file = path.parse(filename);
            file.path = path.resolve(folder, filename);
            file.stat = fs.statSync(file.path);
            files.push(file);
        }
    }
    files.sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
    return files;
}

exports.saveConfig = (config) => {
    dialog.showSaveDialog({ filters: [ JSON_FILTER ] }).then(result => {
        if(!result.canceled) {
            fs.writeFile(result.filePath, JSON.stringify(config), (err) => {
                if(err) {
                    console.log("Error while saving settings: ", err);
                }
            });
        }
    })
};

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