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
const paginationRenderer = new PaginationRenderer(PAGINATION_DISPLAY, 1, 2, 2);
paginationRenderer.subscribePage((page) => {
    albumRenderer.clearDisplay();
    albumApi.requestAlbums(page);
});

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
});

const ID = windowApi.windowId.ALBUM_SELECTION;

window.addEventListener("beforeunload", () => api.unsubscribe(ID));

albumApi.subscribeAlbum(ID, albumRenderer.render);
albumApi.subscribePageInfo(ID, paginationRenderer.render);
albumApi.subscribeAlbumChange(ID, albumRenderer.updateAlbum);

albumApi.requestAlbums(paginationRenderer.getCurrent());
albumApi.requestPageInfo();