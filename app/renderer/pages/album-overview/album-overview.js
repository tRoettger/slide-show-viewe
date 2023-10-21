const CURRENT_ITEM_CLASS = "current-item";

const renderImage = (image) => {
    const element = document.createElement("img");
    element.src = image;
    return element;
};

const renderImageItem = (image, index, registerListener) => {
    const element = document.createElement("div");
    element.classList.add("image-item");
    element.appendChild(renderImage(image));
    element.addEventListener("click", (e) => {
        api.controlSlideshow.goto(index);
        console.log("goto: ", index);
    });
    registerListener(() => {
        element.classList.add(CURRENT_ITEM_CLASS);
    });
    return element;
};

const determineImagesForPage = (currentPage, imagesPerPage, count) => {
    const firstImage = currentPage * imagesPerPage;
    const lastImage = Math.min(firstImage + imagesPerPage, count) - 1;
    const imageIndicies = [];
    for(let i = firstImage; i <= lastImage; i++) {
        imageIndicies.push(i);
    }
    return imageIndicies;
};

class ImageRenderer {
    constructor(display, perPage) {
        this.count = 0;
        this.display = display;
        this.perPage = perPage
        this.listeners = new Map();
        this.requestImagesForPage = this.requestImagesForPage.bind(this);
        this.highlightCurrentItem = this.highlightCurrentItem.bind(this);
    }

    setCount(count) {
        this.count = count;
    }

    #clear() {
        while(this.display.firstChild) {
            this.display.removeChild(this.display.firstChild);
        }
    }

    requestImagesForPage(page) {
        const imgIndicies = determineImagesForPage(page, this.perPage, this.count);
        api.requestImages(imgIndicies, (images) => {
            this.#clear();
            for(let imageWrapper of images) {
                const register = (listener) => this.listeners.set(imageWrapper.index, listener);
                this.display.appendChild(renderImageItem(imageWrapper.image.path, imageWrapper.index, register));
            }
        });
        requestCurrentIndexAndHighlight(this);
    }

    highlightCurrentItem(index) {
        for(let element of document.getElementsByClassName(CURRENT_ITEM_CLASS)) {
            element.classList.remove(CURRENT_ITEM_CLASS);
        }
        const listener = this.listeners.get(index);
        if(listener) {
            listener();
        }
    }
}

const ID = windowApi.windowId.ALBUM_OVERVIEW;
const IMAGES = document.getElementById("images");
const pagination = new PaginationRenderer(document.getElementById("pagination"), 1, 2, 2);
const PER_PAGE = 20;
const imgRenderer = new ImageRenderer(IMAGES, PER_PAGE);

pagination.subscribePage(imgRenderer.requestImagesForPage);

const requestCurrentIndexAndHighlight = (renderer) => api.controlSlideshow.requestCurrentIndex(renderer.highlightCurrentItem);

const handleAlbum = (album) => {
    if(album && album.count) {
        imgRenderer.setCount(album.count);
        pagination.render({count: Math.ceil(album.count / PER_PAGE)});
        requestCurrentIndexAndHighlight(imgRenderer);
    }
};

window.addEventListener("beforeunload", () => api.unsubscribe(ID));
api.subscribeAlbum(ID, handleAlbum);
api.requestAlbum(handleAlbum);
api.controlSlideshow.subscribeCurrentIndex(ID, imgRenderer.highlightCurrentItem);
requestCurrentIndexAndHighlight(imgRenderer);