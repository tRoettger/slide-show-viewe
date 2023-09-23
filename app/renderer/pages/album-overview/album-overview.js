const renderImage = (image) => {
    const element = document.createElement("img");
    element.src = image;
    return element;
};

const renderImageItem = (image, index) => {
    const element = document.createElement("div");
    element.classList += "image-item";
    element.appendChild(renderImage(image));
    element.addEventListener("click", (e) => {
        api.controlSlideshow.goto(index);
        console.log("goto: ", index);
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
            for(let i = 0; i < imgIndicies.length && i < images.length; i++) {
                this.display.appendChild(renderImageItem(images[i].path, imgIndicies[i]));
            }
        });
    }
}

const ID = windowApi.windowId.ALBUM_OVERVIEW;
const IMAGES = document.getElementById("images");
const pagination = new PaginationRenderer(document.getElementById("pagination"), 1, 2, 2);
const PER_PAGE = 20;
const imgRenderer = new ImageRenderer(IMAGES, PER_PAGE);

pagination.subscribePage(imgRenderer.requestImagesForPage);

const handleAlbum =(album) => {
    if(album && album.count) {
        imgRenderer.setCount(album.count);
        pagination.render({count: Math.ceil(album.count / PER_PAGE)});
        imgRenderer.requestImagesForPage(pagination.getCurrent());
    }
};

api.subscribeAlbum(ID, handleAlbum);
api.requestAlbum(handleAlbum);