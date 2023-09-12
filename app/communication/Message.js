exports.AlbumRequestType = {
    PAGE: "page"
};

exports.AlbumRequest = {
    page: (page) => ({type: this.AlbumRequestType.PAGE, page: page})
};