const { Menu } = require('electron');
const { openFolder } = require('./fs-actions.js');
const { handleGeneralError } = require("./error-handling.js");
const { controller } = require("./controller.js");
const { configureApp } = require("./configuration.js");

const MENU_TEMPLATE = [
    {
        label: "Datei",
        submenu: [
            { "role": "open", "label": "Öffnen", "accelerator": "Ctrl+O", click: () => openFolder(handleGeneralError) },
            //{ "role": "save", "label": "Save", "accelerator": "Ctrl+S", click: saveFile},
            { "type": "separator" },
            { "role": "reload", "label": "Neu laden", click: controller.reload },
            { "type": "separator" },
            { "role": "quit", "label": "Beenden" }
        ]
    }, {
        label: "Diashow",
        submenu: [
            { "role": "cfg-app", "label": "Einstellungen", "accelerator": "Ctrl+P", click: configureApp }
        ]
    }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_TEMPLATE));