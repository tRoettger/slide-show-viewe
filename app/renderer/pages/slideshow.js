const ID = windowApi.windowId.SLIDESHOW;

api.notifySlideshowWindowReady();

/* Hide control bar after first hover */
for(let element of document.getElementsByClassName("control-panel-area")) {
    element.addEventListener(
        "pointerenter", 
        (e) => document.documentElement.style.setProperty("--control-bar-visiblity", "none"),
        { once: true }
    );
}

document.body.addEventListener("dragover", (e) => e.preventDefault());

document.body.addEventListener("drop", (event) => {
    event.preventDefault();
    if(event.dataTransfer && (event.dataTransfer.files)) {
        albumApi.loadAlbum(event.dataTransfer.files[0].path);
    } 
});