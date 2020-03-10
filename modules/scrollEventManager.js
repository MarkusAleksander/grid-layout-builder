import debounce from "./debounce.js";

/**
 * Scroll Event Manager
 * Manage functions that rely on the window scroll event
 * Includes debouncing, adding and removal
 */
const scrollEventManager = (function scrollEventManager() {
    let scrollFnStore = [];

    function addScrollEventListener(fn, wait, immediate) {
        let debouncedFn = debounce(fn, wait, immediate);
        let scrollFnID = scrollFnStore.length;

        scrollFnStore.push(debouncedFn);
        window.addEventListener("scroll", debouncedFn);

        return scrollFnID;
    }

    function removeScrollEventListener(idx) {
        if (!idx || !scrollFnStore[idx]);

        window.removeEventListener("scroll", scrollFnStore[idx]);
    }

    return {
        addScrollEventListener: addScrollEventListener,
        removeScrollEventListener: removeScrollEventListener,
    };
})();

export default scrollEventManager;
