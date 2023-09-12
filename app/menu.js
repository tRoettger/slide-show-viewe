const { Menu } = require('electron');
const { slideshowController: controller } = require("./services/SlideshowController");
const { selector } = require("./services/AlbumSelector");
const { fileService } = require('./services/FileService');
const { reloadAll, mainAppWindow, albumSelectionAppWindow, slideshowConfigAppWindow } = require('./model/AppWindow');
const { getOrCreateSlideshowConfigurationWindow } = require('./windows/SlideshowConfigWindow');

const MENU_TEMPLATE = [
    {
        label: "Datei",
        submenu: [
            { 
                label: "Öffnen", accelerator: "Ctrl+O", 
                click: () => fileService.openFolder((folder => controller.openAlbum(folder)))
            },
            {
                label: "Album Auswahl", accelerator: "Alt+A", 
                click: (event) => selector.selectRootFolder(albumSelectionAppWindow.show)
            },
            { type: "separator" },
            { label: "Beenden" }
        ]
    }, {
        label: "Diashow",
        submenu: [
            { 
                label: "Diashow starten", accelerator: "Space", 
                click: controller.startSlideShow, enabled: controller.isRunning
            },
            { 
                label: "Diashow stoppen", accelerator: "Space", 
                click: controller.stopSlideShow, enabled: () => !controller.isRunning()
            },
            { label: "Einstellungen", accelerator: "Ctrl+P", click: getOrCreateSlideshowConfigurationWindow },
            { 
                label: "Gespeicherte Einstellungen laden", accelerator: "Ctrl+L", 
                click: () => fileService.loadConfig((config) => controller.setConfiguration(config))
            },
            { type: "separator" },
            { label: "vorheriges Bild", accelerator: "Left", click: controller.gotoPreviousImage },
            { label: "nächstes Bild", accelerator: "Right", click: controller.gotoNextImage }
        ]
    }, {
        label: "Ansicht",
        submenu: [
            { label: "Vollbild", accelerator: "F11", click: mainAppWindow.toggleFullscreen }
        ]
    }, {
        label: "Entwickler Werkzeuge",
        submenu: [
            { label: "Neu laden", click: reloadAll },
            { label: "Dev Tools (Hauptfenster)", accelerator: "Ctrl+Shift+I", click: mainAppWindow.openDevTools },
            { label: "Dev Tools (Album Auswahl)", click: albumSelectionAppWindow.openDevTools },
            { label: "Dev Tools (Diashow Einstellungen)", click: slideshowConfigAppWindow.openDevTools }
        ]
    }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_TEMPLATE));