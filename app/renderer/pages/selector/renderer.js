const ALBUMS_DISPLAY = document.getElementById("albums");
const PAGINATION_DISPLAY = document.getElementById("pagination");
const FORM_FILTER = document.getElementById("filter-form");
const INPUT_FILTER = document.getElementById("filter-input");
const SELECT_ORDER = document.getElementById("order");
const BTN_CLEAR = document.getElementById("filter-input-clear-btn");

const requestFilteredAlbums = (value) => {
    albumRenderer.clearDisplay();
    albumApi.filterAlbums(value);
};

const albumRenderer = createRenderer(ALBUMS_DISPLAY);
const paginationRenderer = createPagination(albumRenderer, PAGINATION_DISPLAY);

FORM_FILTER.addEventListener("submit", e => {
    e.preventDefault();
    requestFilteredAlbums(INPUT_FILTER.value);
});

BTN_CLEAR.addEventListener("click", e => {
    INPUT_FILTER.value = "";
    requestFilteredAlbums("");
});

SELECT_ORDER.addEventListener("change", e => {
    albumRenderer.clearDisplay();
    albumApi.changeAlbumOrder(SELECT_ORDER.value);
})

console.log(albumApi);

const ID = "album-selector";

albumApi.subscribeAlbum(ID, albumRenderer.render);
albumApi.subscribePageInfo(ID, paginationRenderer.render);
albumApi.subscribeAlbumChange(ID, albumRenderer.updateAlbum);