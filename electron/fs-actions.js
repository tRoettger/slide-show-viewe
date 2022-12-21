const { dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { controller } = require("./controller.js");

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