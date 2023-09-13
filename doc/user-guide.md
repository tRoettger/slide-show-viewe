# Disclaimer

Currently the application is not localized.  
Therefore controls and menu paths will be contained in german and english in this guide.  
First the german version (as is the application) and the in brackets the english version:  
E.g. `Datei > Öffnen (File > Open)`  
The reasoning behind this is to make a potential future localisation easier.  

**THERE IS NO TIMELINE OR COMMITMENT FOR A LOCALISATION**  
Maybe it will be done, maybe it won't.

# Abstract

The slideshow viewer is an application to present images from folders.  
It provides options to configure the way of presenting them.  

Furthermore it provides several features to ease the access to them.  

# Open album

There are multiple options how to open an [album].

## Direct

The shortcut für this function is `Ctrl+O`.  
The function can also be called via the menu path `Datei > Öffnen (File > Open)`.  
In both cases an open-folder-dialog will open.  
If the selection is accepted by `Ordner auswählen (choose folder)`, the selected folder is opened as [album].

If the selection is canceled by `Abbrechen (cancel)`, the currently loaded [album] is closed.  
After that the welcome-screen of the application is displayed.

## Album selection

[album-selection]: (#album-selection)

The aim of this function is to make switching between different [album]s more easy.

The shortcut for this function is 'Alt+A'.  
The function can also be called via the menu path `Datei > Album Auswahl (File > Album Selection)`.  
In both cases a open-folder-dialog will open.  
This dialog allows to select multiple folders.

If the selection is accepted by `Ordner öffnen (choose folder)`, the [album-selection-window] will open.  
This window shows all [album]s contained in the selected folders.  
If a folder contains multiple subfolders with images, each of those subfolders is displayed as [album].

### Album selection window

[album-selection-window]: (#album-auswahl-window)

![Album selection window](./screenshots/album-selection.png)

To load into [slideshow-window] an [album] click on it in the [album-selection-window].

Each [album] is displayed by a [cover] und the name of its folder.  
Additional information of an [album] is displayed on hovering over it.  

Further [album]s can be added by calling the function again via menu item or shortcut.  
To clear the selection, close the [album-selection-window].  
A maximum of 20 [album]s can be displayed at once.  
To access further [album]s use the pagination at the bottom of the window.

### Search and sort

The displayed [album]s can be sorted via the drop-drop-selection in the top left of the window.  
Searching for specific [album]s can be done via the search field in the top right.  
If a text is entered into the search field and confirmed by hitting `Enter`, only [album]s whose names contain the entered text are displayed.  
To remove the search filter, use the `x` an the end of the search field.  
Alternatively use clear the search field and hit `Enter`.

### Cover

[cover]: (#cover)

An image to represent an [album].  
The first image is used as [cover] is used, if non is defined for the [album].  
The [cover] of an [album] can be changed by `rightclicking` it in the [album-selection-window].  
If a [cover] image is located in the folder of an [album], this setting persists when the folder is moved to another location.  
The first image is used, if the configured [cover] image does not exists (anymore).

**Technical details**
> A .json file is created in the [album]s folder, to store the [cover] configuration.  
> Deleting this file only cause a reset of the [cover].  
> The file can be transfered to other PCs along with the folder.

# Glossary

## Album

[album]: (#album)
[Album]: (#album)

In general the term "[album]" is used to describe a set of images in the context of this application.  
Those are loaded from folders, therefore the term might also be used for those folders.  

## Slideshow

[slideshow]: (#slideshow)
[Slideshow]: (#slideshow)

In the context of this application the term "[slideshow]" is used for sequences of images.