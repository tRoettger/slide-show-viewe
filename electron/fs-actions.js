const { dialog } = require("electron");
const fs = require("fs");

exports.openFolder = (onError) => {
    dialog.showOpenDialog({
        properties: [ 'openDirectory' ]
    }).then(result => {
        var r = loadFiles(result.filePaths, onError);
        console.log("R: ", r);
    });
};

const loadFiles = (folders, onError) => {
    var files = [];
    for(var folder of folders) {
        fs.readdir(folder, (err, filesnames) => {
            if(err) {
                onError("Error occured while reading folder \"" + folder + "\".", err);
            } else {
                for(var file of filesnames) { files.push(file); }
            }
        });
    }
    return files;
}