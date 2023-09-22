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
        this.pageListeners = [];
    }

    subscribePage(listener) {
        this.pageListeners.push(listener);
    }

    #clearDisplay() {
        while(this.display.firstChild != null)
            this.display.removeChild(this.display.lastChild);
    }

    #createPageItem(page) {
        let item = document.createElement(this.current == page ? "div" : "a");
        item.className = "page-item";
        item.appendChild(document.createTextNode(page + this.offset));
        item.addEventListener("click", (e) => this.gotoPage(page));
        return item;
    }

    #createSeparator() {
        let separator = document.createElement("div");
        separator.className = "page-separator";
        separator.appendChild(document.createTextNode("..."));
        return separator;
    }

    #determineVisiblePages() {
        let visiblePages = [];
        for(let i = this.current - this.before; i <= this.current + this.after; i++) {
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
        this.#requestAlbums(page);
    }

    #requestAlbums(page) {
        for(let listener of this.pageListeners) {
            listener(page);
        }
    }

    getCurrent() {
        return this.current;
    }

    #isSeparatorRequired(index, visiblePages) {
        return index + 1 < visiblePages.length
            && ((visiblePages[index + 1] - visiblePages[index]) > 1);
    }

    render(pageInfo) {
        this.#clearDisplay();
        this.count = pageInfo.count;
        this.#renderToDisplay();
        this.#requestAlbums(this.current);
    }

    #renderToDisplay() {
        let visiblePages = this.#determineVisiblePages();
        console.log("visiblePages: ", visiblePages);
        for(let index in visiblePages) {
            let currentPage = visiblePages[index];
            this.display.appendChild(this.#createPageItem(currentPage));
            if(this.#isSeparatorRequired(index * 1, visiblePages)) {
                this.display.appendChild(this.#createSeparator());
            }
        }
    }
}
const createPagination = (albumRenderer, paginationDisplay) => {
    const albumPagination = new PaginationRenderer(paginationDisplay, 1, 2, 2);
    albumPagination.subscribePage((page) => {
        albumRenderer.clearDisplay();
        albumApi.requestAlbums(page);
    })
    return albumPagination;
};