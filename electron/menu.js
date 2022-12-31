const { Menu } = require('electron');
const { openFolder, loadConfig } = require('./fs-actions');
const { controller } = require("./controller");
const { configureApp } = require("./configuration");
const { selector } = require("./selector");

const MENU_TEMPLATE = [
    {
        label: "Datei",
        submenu: [
            { "role": "open", "label": "Öffnen", "accelerator": "Ctrl+O", click: openFolder },
            { "role": "album-selection", "label": "Album Auswahl", "accelerator": "Alt+A", click: selector.openWindow },
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
            { "role": "reload", "label": "Neu laden", click: controller.reload },
            { "role": "dev-tools", "label": "Dev Tools (Hauptfenster)", "accelerator": "Ctrl+Shift+I", click: controller.openDevTools },
            { "role": "dev-tools", "label": "Dev Tools (Album Auswahl)", click: selector.openDevTools }
        ]
    }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_TEMPLATE));