const { dialog } = require("electron");
const fs = require("fs");

exports.openFolder = () => {
    dialog.showOpenDialog({
        properties: [ 'openDirectory' ]
    }).then(result => {
        console.log("Result: ", result);
    });
};