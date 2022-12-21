const openAlbum = (imgCount) => {
    console.log(imgCount);
    var root = document.getElementById("root");
    for(var i = 0; i < imgCount; i++) {
        var image = document.createElement("img");
        image.id = "album-image-" + i;
        root.appendChild(image);
    }
};

const showAlbumImage = (index, data) => {
    console.log("Setting image of index: ", index);
    document.getElementById("album-image-" + index)
        .src = "data:image/jpg;base64," + data;
};