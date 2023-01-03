exports.createConfig = (viewDuration, transitionDuration, timingFunction) => ({
    viewDuration: viewDuration, 
    transitionDuration: transitionDuration, 
    timingFunction: timingFunction
});

const IMG_EXT = [".JPG", ".PNG", ".GIF"];
const isImageExtension = (extension) => IMG_EXT.includes(extension.toUpperCase());

exports.isImage = (file) => file.stat.isFile() && isImageExtension(file.ext);
exports.IMAGE_FILTER = { name: "Bilder (jpg, png, gif)", extensions: [
    "jpg", "png", "gif"
]};