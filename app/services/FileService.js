const { getDefaultSlideShowConfigPath } = require("../windows/configuration");
const fs = require("fs");
const { dialog } = require("electron");
const path = require("path");
const { IMAGE_FILTER } = require("../../shared/slide-show");
const { ALBUM_PROPERTIES_FILE } = require("../../shared/constants");

class FileService {
    constructor(albumPropertiesFilename, configFileFilter, imageFilter) {
        this.albumPropertiesFilename = albumPropertiesFilename;
        this.configFileFilter = configFileFilter;
        this.imageFilter = imageFilter;
    }

    openFolder(callback) {
        dialog.showOpenDialog({ properties: [ 'openDirectory' ]})
        .then(result => this.loadFiles(result.filePaths))
        .then(callback);
    }

    loadFiles(folders) {
        let files = [];
        for(let folder of folders) {
            for (var filename of fs.readdirSync(folder)) {
                files.push(this.parseFilePath(folder, filename));
            }
        }
        files.sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
        return files;
    }

    parseFilePath(folder, filename) {
        var file = path.parse(filename);
        file.path = path.resolve(folder, filename);
        file.stat = fs.statSync(file.path);
        return file;
    }

    #saveConfigToFile(config, filePath) {
        fs.writeFile(filePath, JSON.stringify(config), (err) => {
            if(err) { console.log("Error while saving settings: ", err); }
        });
    }

    saveConfigAs(config) {
        dialog.showSaveDialog({ filters: [ this.configFileFilter ] }).then(result => {
            if(!result.canceled) { this.#saveConfigToFile(config, result.filePath); }
        });
    }

    saveConfig(config) {
        this.#saveConfigToFile(config, getDefaultSlideShowConfigPath());
    }

    loadConfig(callback) {
        dialog.showOpenDialog({
            properties: [ 'openFile' ],
            filters: [ this.configFileFilter ]
        }).then(result => this.loadConfigFrom(result.filePaths[0], callback));}

    loadConfigFrom(path, callback) {
        fs.readFile(path, (err, data) => {
            if(err) {
                console.log("Error while reading file: ", err);
            } else {
                callback(JSON.parse(data));
            }
        })
    }

    #getAlbumCfgPath(folder) {
        return path.join(folder, this.albumPropertiesFilename)
    }

    loadAlbumProps(folder) {
        var cfgPath = this.#getAlbumCfgPath(folder);
        if(fs.existsSync(cfgPath)) {
            var result = fs.readFileSync(cfgPath, { encoding: "utf-8" });
            return JSON.parse(result);
        }
    }

    storeAlbumProps(folder, props) {
        var cfgPath = this.#getAlbumCfgPath(folder);
        fs.writeFile(cfgPath, JSON.stringify(props), (err) => {
            if(err) { console.log("Error while saving album properties: ", err); }
        });}

    selectImage(dialogTitle, defaultPath) {
        var options = { 
            properties: ['openFile'], 
            filters: [ this.imageFilter ],
            title: dialogTitle
        };
        if(defaultPath) {
            options.defaultPath = defaultPath;
        }
        return dialog.showOpenDialog(options);

    }
}

const JSON_FILTER = { name: "JavaScript Object Notation", extensions: [ "json" ] };
exports.fileService = new FileService(ALBUM_PROPERTIES_FILE, JSON_FILTER, IMAGE_FILTER);