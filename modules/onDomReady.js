/**
 * Execute a callback when the DOM has loaded
 * @param {function} fn
 */
export default function onDomReady(fn) {
    if (
        document.attachEvent
            ? document.readyState === "complete"
            : document.readyState !== "loading"
    ) {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
