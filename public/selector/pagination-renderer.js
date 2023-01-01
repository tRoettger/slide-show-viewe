const { ipcRenderer } = require("electron");
const { Channel, AlbumRequest } = require("../../shared/communication");
const { albumRenderer } = require("./album-renderer");

const PAGINATION_DISPLAY = document.getElementById("pagination");

class PaginationRenderer {
    constructor(display, offset, before, after) {
        this.display = display;
        this.offset = offset;
        this.before = before;
        this.after = after;
        this.count = 0;
        this.current = 0;
        this.render = this.render.bind(this);
        this.gotoPage = this.gotoPage.bind(this);
    }

    #clearDisplay() {
        while(this.display.firstChild != null)
            this.display.removeChild(this.display.lastChild);
    }

    #createPageItem(page) {
        var item = document.createElement(this.current == page ? "div" : "a");
        item.className = "page-item";
        item.appendChild(document.createTextNode(page + this.offset));
        item.addEventListener("click", (e) => this.gotoPage(page));
        return item;
    }

    #createSeparator() {
        var separator = document.createElement("div");
        separator.className = "page-separator";
        separator.appendChild(document.createTextNode("..."));
        return separator;
    }

    #determineVisiblePages() {
        var visiblePages = [];
        for(var i = this.current - this.before; i <= this.current + this.after; i++) {
            if(i > 0 && i < this.count)
                visiblePages.push(i);
        }

        // add first and last page if they are not contained.
        if(!visiblePages.includes(0)) visiblePages.unshift(0);
        if(!visiblePages.includes(this.count - 1)) visiblePages.push(this.count - 1);

        return visiblePages;
    }

    gotoPage(page) {
        this.#clearDisplay();
        this.current = page;
        this.#renderToDisplay();
        albumRenderer.clearDisplay();
        ipcRenderer.send(Channel.REQUEST_ALBUMS, AlbumRequest.page(page));
    }

    #isSeparatorRequired(index, visiblePages) {
        return index + 1 < visiblePages.length
            && ((visiblePages[index + 1] - visiblePages[index]) > 1);
    }

    render(pageInfo) {
        this.#clearDisplay();
        this.count = pageInfo.count;
        this.#renderToDisplay();
    }

    #renderToDisplay() {
        var visiblePages = this.#determineVisiblePages();
        console.log("visiblePages: ", visiblePages);
        for(var index in visiblePages) {
            var currentPage = visiblePages[index];
            this.display.appendChild(this.#createPageItem(currentPage));
            if(this.#isSeparatorRequired(index * 1, visiblePages)) {
                this.display.appendChild(this.#createSeparator());
            }
        }
    }
}
exports.paginationRenderer = new PaginationRenderer(PAGINATION_DISPLAY, 1, 2, 2);