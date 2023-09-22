const renderImage = (image, width, height) => {
    const element = document.createElement("img");
    element.src = image;
    element.width = width;
    element.height = height;
    return element;
};

const renderImageItem = (image, width, height) => {
    const element = document.createElement("div");
    element.classList += "image-item";
    element.appendChild(renderImage(image, width, height));
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
    constructor(display, perPage, width, height) {
        this.count = 0;
        this.display = display;
        this.width = width;
        this.height = height;
        this.perPage = perPage
        this.requestImagesForPage = this.requestImagesForPage.bind(this);
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
            for(let image of images) {
                this.display.appendChild(renderImageItem(image.path, this.width, this.height));
            }
        });
    }
}

const ID = windowApi.windowId.ALBUM_OVERVIEW;
const IMAGES = document.getElementById("images");
const pagination = new PaginationRenderer(document.getElementById("pagination"), 1, 2, 2);
const PER_PAGE = 20;
const imgRenderer = new ImageRenderer(IMAGES, 20, 100, 100);

pagination.subscribePage(imgRenderer.requestImagesForPage);

api.subscribeAlbum(ID, (album) => {
    if(album && album.count) {
        imgRenderer.setCount(album.count);
        pagination.render({count: Math.ceil(album.count / PER_PAGE)});
        imgRenderer.requestImagesForPage(pagination.getCurrent());
    }
});