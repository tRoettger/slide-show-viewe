const FORM_CONFIG = document.getElementById("config-form");
const SELECT_TRANSITION = document.getElementById("transition-timing-function");
const INPUT_TRANSITION = document.getElementById("transition-duration");
const INPUT_VIEW = document.getElementById("view-duration");
const BTN_SAVE_AS = document.getElementById("save-as-btn");

const getConfig = () => ([
    INPUT_VIEW.value * 1,
    INPUT_TRANSITION.value * 1,
    SELECT_TRANSITION.value
]);

FORM_CONFIG.addEventListener("submit", (e) => {
    e.preventDefault();
    configApi.saveConfig(...getConfig());
});

BTN_SAVE_AS.addEventListener("click", (e) => {
    configApi.saveConfigAs(...getConfig());
});

api.subscribeSlideshowConfiguration((config) => {
    INPUT_VIEW.value = config.viewDuration;
    INPUT_TRANSITION.value = config.transitionDuration;
    SELECT_TRANSITION.value = config.timingFunction;
});

configApi.notifyInitialized();