const { Menu } = require('electron');
const { openFolder, loadConfig } = require('./fs-actions.js');
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
            { "role": "start-slide-show", "label": "Diashow starten/stoppen", "accelerator": "Space", click: controller.startSlideShow },
            { "role": "cfg-app", "label": "Einstellungen", "accelerator": "Ctrl+P", click: configureApp },
            { "role": "load-cfg", "label": "Gespeicherte Einstellungen laden", "accelerator": "Ctrl+L", click: loadConfig },
            { "type": "separator" },
            { "role": "next", "label": "vorheriges Bild", "accelerator": "Left", click: controller.gotoPreviousImage },
            { "role": "next", "label": "nächstes Bild", "accelerator": "Right", click: controller.gotoNextImage }
        ]
    }, {
        label: "Ansicht",
        submenu: [
            { "role": "fullscreen", "label": "Vollbild", "accelerator": "F11", click: controller.changeScreenMode }
        ]
    }, {
        label: "Entwickler Werkzeuge",
        submenu: [
            { "role": "dev-tools", "label": "Chromium Dev Tools", "accelerator": "Ctrl+Shift+I", click: controller.openDevTools }
        ]
    }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_TEMPLATE));