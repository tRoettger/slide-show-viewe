exports.AlbumRequestType = {
    PAGE: "page"
};

exports.AlbumRequest = {
    page: (page) => ({type: AlbumRequestType.PAGE, page: page})
};