const { Menu } = require('electron');
const { openFolder } = require('./fs-actions.js');
const { handleGeneralError } = require("./error-handling.js");
const { controller } = require("./controller.js");

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
        label: "Einstellungen",
        submenu: [
            //{ "role": "cfg-app", "label": "Configuration", click: configApp },
            //{ "role": "cfg-defaults", "label": "Defaults", click: configDefaults }
        ]
    }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_TEMPLATE));