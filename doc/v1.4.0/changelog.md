# Changelog v1.4.0
## [Feature] Sort albums in album selection
Add the possible to sort albums within album selection.
For illustration let's assume the following folder structure:
* C:/pictures
  * photos
    * **games** (created 2022-01)
      * 10 Images
    * **plants** (created 2022-06)
      * 20 Images
    * **selfies** (created 2022-03)
      * 15 Images
  * trips
    * **april** (created 2022-04)
      * 50 Images
    * **february** (created 2022-02)
      * 100 Images
    * **may** (created 2022-05)
      * 17 Images

Options:
- **Path: A - Z** (Default)
Sorts the albums in alphabetic order based on their file path.
The order of the albums from above is:
```
  games, plants, selfies, april, february, may
```
- **Path: Z - A**
The reverted order of **Path: A - Z**`
The order of the albums from above is:
```
  may, february, april, selfies, plants, games
```
- **Name: A - Z**
Sorts the albums alphabetically based on their folders name.
Ignores the file path.
The order of the albums from above is:
```
  april, february, games, may, plants, selfies
```
- **Name: Z - A**
The reverted order of **Name: A - Z**`
The order of the albums from above is:
```
  selfies, plants, may, games, february, april
```
- **Date: New - Old**
Sorts the albums based on their creation date from new to old.
The order of the albums from above is:
```
    games, february, selfies, april, may, plants
```
- **Date: Old - New**
Sorts the albums based on their creation date from old to new.
The order of the albums from above is:
```
    plants, may, april, selfies, february, games
```
- **Size: Small - Big**
Sorts the albums based on their picture count from small to big.
The order of the albums from above is:
```
    games, selfies, may, plants, april, february
```
- **Size: Big - Small**
Sorts the labum based on their picture count from big to small.
The order of the albums from above is:
```
    february, april, plants, may, selfies, games
```

When an option is selected the albums are sorted by the given option.

## [Feature] Search for album name in album selection
Add a search field to the album selection.
No live search!