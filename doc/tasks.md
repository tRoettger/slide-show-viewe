# [Feature] Show addition image information
Make it possible to show additional image information such as:
- filename
- recording date
- original size
- dpi
- camera refactorer & model
- location data (nice to have: add link to maps.google.com)

# [Feature] Sort albums in album selection
Add the possible to sort albums within album selection.
Options:
- Path: A - Z (Default)
- Path: Z - A
- Name: A - Z
- Name: Z - A
- Date: New - Old
- Date: Old - New
- Size: Small - Big
- Size: Big - Small

When an option is selected the albums are sorted by the given option.

# [Feature] Search for album name in album selection
Add a search field to the album selection.
No live search!

# [Feature] Change cover of album
Store a slideshow-viewer.json file in the albums folder.
This file is meant to keep information for the slideshow viewer.
With this feature adds the information which image to use as cover.
Upon loading this album into the album selection, the cover from this file will be used.
The path to the cover is relative to the album folder.
This is to make albums portable without loosing information.