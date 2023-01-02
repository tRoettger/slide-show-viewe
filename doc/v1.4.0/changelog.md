# Changelog v1.4.0
## [Feature] Sort albums in album selection
Add the possible to sort albums within album selection.
Options:
- Path: A - Z (Default)
Sorts the albums in alphabetic order based on their file path.
Meaning C:/some/path/to/album is before C:/some/path/to/other/album.
Also it parent folders will be before their subfolders.
E.g. C:/Pictures is before C:/Pictures/archive (in this case C:/Pictures will contain pictures as well).
- Path: Z - A
- Name: A - Z
- Name: Z - A
- Date: New - Old
- Date: Old - New
- Size: Small - Big
- Size: Big - Small

When an option is selected the albums are sorted by the given option.

## [Feature] Search for album name in album selection
Add a search field to the album selection.
No live search!