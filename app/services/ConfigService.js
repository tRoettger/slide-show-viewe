const { Observable } = require("../model/Observable");

class ConfigService extends Observable {
    constructor(initialConfig) {
        super((listener) => listener(this.config));
        this.config = initialConfig;
    }

    setConfig(config) {
        this.config = config;
        this.notify((listener) => listener(config));
    }

}

exports.configService = new ConfigService({});