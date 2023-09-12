const { Menu } = require('electron');
const { slideshowController: controller } = require("./services/SlideshowController");
const { configureApp, devTools } = require("./windows/configuration");
const { selector } = require("./windows/AlbumSelector");
const { fileService } = require('./services/FileService');
const { reloadAll, mainAppWindow, albumSelectionAppWindow } = require('./model/AppWindow');

const MENU_TEMPLATE = [
    {
        label: "Datei",
        submenu: [
            { 
                "role": "open", "label": "Öffnen", "accelerator": "Ctrl+O", 
                click: () => fileService.openFolder((folder => controller.openAlbum(folder)))
            },
            {
                "role": "album-selection", "label": "Album Auswahl", "accelerator": "Alt+A", 
                click: (event) => selector.selectRootFolder(albumSelectionAppWindow.show)
            },
            { "type": "separator" },
            { "role": "quit", "label": "Beenden" }
        ]
    }, {
        label: "Diashow",
        submenu: [
            { "role": "start-slide-show", "label": "Diashow starten/stoppen", "accelerator": "Space", click: controller.startSlideShow },
            { "role": "cfg-app", "label": "Einstellungen", "accelerator": "Ctrl+P", click: configureApp },
            { 
                "role": "load-cfg", "label": "Gespeicherte Einstellungen laden", "accelerator": "Ctrl+L", 
                click: () => fileService.loadConfig((config) => controller.setConfiguration(config))
            },
            { "type": "separator" },
            { "role": "next", "label": "vorheriges Bild", "accelerator": "Left", click: controller.gotoPreviousImage },
            { "role": "next", "label": "nächstes Bild", "accelerator": "Right", click: controller.gotoNextImage }
        ]
    }, {
        label: "Ansicht",
        submenu: [
            { "role": "fullscreen", "label": "Vollbild", "accelerator": "F11", click: mainAppWindow.toggleFullscreen }
        ]
    }, {
        label: "Entwickler Werkzeuge",
        submenu: [
            { "role": "reload", "label": "Neu laden", click: reloadAll },
            { "role": "dev-tools", "label": "Dev Tools (Hauptfenster)", "accelerator": "Ctrl+Shift+I", click: mainAppWindow.openDevTools },
            { "role": "dev-tools", "label": "Dev Tools (Album Auswahl)", click: albumSelectionAppWindow.openDevTools },
            { "role": "dev-tools", "label": "Dev Tools (Diashow Einstellungen)", click: devTools}
        ]
    }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_TEMPLATE));