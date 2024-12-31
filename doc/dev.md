# Abstract
The slide show viewer creates slideshows based on the image files in a folder.

## Setup instructions

If you are working with linux based systems, you have to configure the `chrome-sandbox` correctly:

```bash
sudo chown root:$(whoami) node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
```