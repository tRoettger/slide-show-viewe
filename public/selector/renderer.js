const { ipcRenderer } = require("electron");
const { AlbumSorter, Channel } = require("../../shared/communication");
const { albumRenderer } = require("./album-renderer");
const { paginationRenderer } = require("./pagination-renderer");
require("./event-listener")

const SELECT_ORDER = document.getElementById("order");

const createSorter = (value, display, title) => ({
    value: value,
    display: display,
    title: title
});

[
    createSorter(
        AlbumSorter.PATH_ASC, 
        "Ordnerpfad: A - Z", 
        "Sortiert die Alben aufsteigend nach ihrem Ordnerpfad."
    ),
    createSorter(
        AlbumSorter.PATH_DESC,
        "Ordnerpfad: Z - A",
        "Sortiert die Alben absteigend nach ihrem Ordnerpfad."
    ),
    createSorter(
        AlbumSorter.NAME_ASC,
        "Name: A - Z",
        "Sortiert die Alben aufsteigend nach ihrem Namen."
    ),
    createSorter(
        AlbumSorter.NAME_DESC,
        "Name: Z - A",
        "Sortiert die Alben absteigend nach ihrem Namen."
    ),
    createSorter(
        AlbumSorter.DATE_ASC,
        "Datum: Alt - Neu",
        "Sortiert die Alben aufsteigend nach ihrem Alter."
    ),
    createSorter(
        AlbumSorter.DATE_DESC,
        "Datum: Neu - Alt",
        "Sortiert die Alben absteigend nach ihrem Alter."
    ),
    createSorter(
        AlbumSorter.SIZE_ASC,
        "Größe: Klein - Groß",
        "Sortiert die Alben aufsteigend nach ihrer Bilderanzahl."
    ),
    createSorter(
        AlbumSorter.SIZE_DESC,
        "Größe: Groß - Klein",
        "Sortiert die Alben absteigend nach ihrer Bilderanzahl."
    )
]
.map(sorter => {
    var element = document.createElement("option");
    element.value = sorter.value;
    element.title = sorter.title;
    element.appendChild(document.createTextNode(sorter.display));
    return element;
})
.forEach(element => SELECT_ORDER.appendChild(element));

ipcRenderer.on(Channel.NOTIFY_ALBUM, (event, album) => {
    albumRenderer.render(album);
});

ipcRenderer.on(Channel.NOTIFY_PAGE_INFO, (event, pageInfo) => {
    paginationRenderer.render(pageInfo);
});

ipcRenderer.on(Channel.NOTIFY_COVER_CHANGED, (event, album) => {
    albumRenderer.updateAlbum(album);
});