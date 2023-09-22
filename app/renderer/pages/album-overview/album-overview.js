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

const IMAGES = document.getElementById("images");
const pagination = new PaginationRenderer(document.getElementById("pagination"), 1, 2, 2);

// TEST CODE:

for(let i = 0; i < 50; i++) {
    IMAGES.appendChild(renderImageItem("", 100, 100))
}

pagination.render({count: 300});
