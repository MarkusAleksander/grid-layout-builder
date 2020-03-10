/**
 * Get the users scroll position as a percentage down the page
 */
export default function getScrollProgress() {
    var h = document.documentElement,
        b = document.body,
        st = "scrollTop",
        sh = "scrollHeight";
    return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
}
