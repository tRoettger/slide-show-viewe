# Abstract
The slide show viewer creates slideshows based on the image files in a folder.

## Scripts

- start: starts the application in testmode for Windows (not sure whether it still works).
- dev: starts the application in testmode for Linux-based systems.
- dist: creates a distributable of the application (used to create releases).

## Setup instructions

If you are working with linux based systems, you have to configure the `chrome-sandbox` correctly:

```bash
sudo chown root:$(whoami) node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
```