const { Menu } = require('electron');
const { slideshowController: controller } = require("./services/SlideshowController");
const { selector } = require("./services/AlbumSelector");
const { fileService } = require('./services/FileService');
const { reloadAll, mainAppWindow, albumSelectionAppWindow, slideshowConfigAppWindow } = require('./model/AppWindow');
const { getOrCreateSlideshowConfigurationWindow } = require('./windows/SlideshowConfigWindow');

const MenuItemId = {
    START_SLIDESHOW: "start-slideshow",
    STOP_SLIDESHOW: "stop-slideshow"
};

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
                label: "Diashow starten", accelerator: "Space", registerAccelerator: false,
                click: controller.startSlideShow, id: MenuItemId.START_SLIDESHOW
            },
            { 
                label: "Diashow stoppen",  accelerator: "Space", registerAccelerator: false,
                click: controller.stopSlideShow, id: MenuItemId.STOP_SLIDESHOW, enabled: false
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
            { label: "Neu laden", click: reloadAll, accelerator: "Ctrl+R" },
            { label: "Dev Tools (Hauptfenster)", accelerator: "Ctrl+Shift+I", click: mainAppWindow.openDevTools },
            { label: "Dev Tools (Album Auswahl)", click: albumSelectionAppWindow.openDevTools },
            { label: "Dev Tools (Diashow Einstellungen)", click: slideshowConfigAppWindow.openDevTools }
        ]
    }
];

controller.subscribeState((running) => {
    Menu.getApplicationMenu().getMenuItemById(MenuItemId.START_SLIDESHOW).enabled = !running;
    Menu.getApplicationMenu().getMenuItemById(MenuItemId.STOP_SLIDESHOW).enabled = running;
});

Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_TEMPLATE));