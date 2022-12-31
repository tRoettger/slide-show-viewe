const PAGINATION_DISPLAY = document.getElementById("pagination");

class PaginationRenderer {
    constructor(display, offset, before, after) {
        this.display = display;
        this.offset = offset;
        this.before = before;
        this.after = after;
        this.current = 0;
        this.render = this.render.bind(this);
    }

    #clearDisplay() {
        while(this.display.firstChild != null)
            this.display.removeChild(this.display.lastChild);
    }

    #createPageItem(page) {
        var item = document.createElement(this.current == page ? "div" : "a");
        item.className = "page-item";
        item.appendChild(document.createTextNode(page));
        return item;
    }

    #createSeparator() {
        var separator = document.createElement("div");
        separator.className = "page-separator";
        separator.appendChild(document.createTextNode("..."));
        return separator;
    }

    #determineVisiblePages(pageInfo) {
        var visiblePages = [];
        for(var i = this.current - this.before; i <= this.current + this.after; i++) {
            if(i > 0 && i < pageInfo.count)
                visiblePages.push(i);
        }

        // add first and last page if they are not contained.
        if(!visiblePages.includes(0)) visiblePages.unshift(0);
        if(!visiblePages.includes(pageInfo.count - 1)) visiblePages.push(pageInfo.count - 1);
        
        visiblePages.map(i => i + this.offset);

        return visiblePages;
    }

    #isSeparatorRequired(index, visiblePages) {
        console.log("isSeparatorRequired: ", {
            index: index,
            nextIndex: index + 1,
            current: visiblePages[index],
            next: visiblePages[index + 1],
            visiblePages: visiblePages
        });
        return index + 1 < visiblePages.length
            && ((visiblePages[index + 1] - visiblePages[index]) > 1);
    }

    render(pageInfo) {
        this.#clearDisplay();
        var visiblePages = this.#determineVisiblePages(pageInfo);
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