const { Menu } = require('electron');
const { slideshowService: controller } = require("./services/SlideshowService");
const { selector } = require("./services/AlbumSelector");
const { fileService } = require('./services/FileService');
const { reloadAll, mainAppWindow, albumSelectionAppWindow, slideshowConfigAppWindow, albumOverviewAppWindow } = require('./model/AppWindow');
const { slideshowConfigWindow } = require('./windows/SlideshowConfigWindow');
const { albumOverviewWindow } = require('./windows/AlbumOverviewWindow');
const { mainWindow } = require('./windows/SlideshowWindow');
const { configService } = require('./services/ConfigService');
const { slideshowPlayer } = require('./services/SlideshowPlayer');

const MenuItemId = {
    START_SLIDESHOW: "start-slideshow",
    STOP_SLIDESHOW: "stop-slideshow"
};

const pauseAndReloadAll = () => {
    slideshowPlayer.pause();
    reloadAll();
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
                click: () => selector.selectRootFolder(albumSelectionAppWindow.show)
            },
            { type: "separator" },
            { label: "Beenden", click: () => mainWindow.close() }
        ]
    }, {
        label: "Diashow",
        submenu: [
            { label: "Diashow starten/pausieren", visible: false, accelerator: "Space", click: slideshowPlayer.toggle },
            { 
                label: "Diashow starten", accelerator: "Space", registerAccelerator: false,
                click: slideshowPlayer.start, id: MenuItemId.START_SLIDESHOW
            },
            { 
                label: "Diashow pausieren",  accelerator: "Space", registerAccelerator: false,
                click: slideshowPlayer.pause, id: MenuItemId.STOP_SLIDESHOW, enabled: false
            },
            { label: "vorheriges Bild", accelerator: "Left", click: slideshowPlayer.previous },
            { label: "nächstes Bild", accelerator: "Right", click: slideshowPlayer.next },
            { type: "separator" },
            { label: "Übersicht", accelerator: "Alt+O", click: albumOverviewWindow.focus },
            { label: "Diashow Fenster", visible: false, accelerator: "Alt+1", click: () => mainWindow.focus() },
            { type: "separator" },
            { label: "Einstellungen", accelerator: "Ctrl+P", click: slideshowConfigWindow.focus },
            { 
                label: "Gespeicherte Einstellungen laden", accelerator: "Ctrl+L", 
                click: () => fileService.loadConfig((config) => configService.setConfig(config))
            }
        ]
    }, {
        label: "Ansicht",
        submenu: [
            { label: "Vollbild", accelerator: "F11", click: mainAppWindow.toggleFullscreen },
            { label: "Vollbild beenden", visible: false, accelerator: "Esc", click: mainAppWindow.setWindowed },
        ]
    }, {
        label: "Entwickler Werkzeuge",
        submenu: [
            { label: "Neu laden", click: pauseAndReloadAll, accelerator: "Ctrl+R" },
            { label: "Dev Tools (Hauptfenster)", accelerator: "Ctrl+Shift+I", click: mainAppWindow.openDevTools },
            { label: "Dev Tools (Album Auswahl)", click: albumSelectionAppWindow.openDevTools },
            { label: "Dev Tools (Diashow Einstellungen)", click: slideshowConfigAppWindow.openDevTools },
            { label: "Dev Tools (Album Übersicht)", click: albumOverviewAppWindow.openDevTools }
        ]
    }
];

controller.subscribeState((running) => {
    Menu.getApplicationMenu().getMenuItemById(MenuItemId.START_SLIDESHOW).enabled = !running;
    Menu.getApplicationMenu().getMenuItemById(MenuItemId.STOP_SLIDESHOW).enabled = running;
});

Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_TEMPLATE));