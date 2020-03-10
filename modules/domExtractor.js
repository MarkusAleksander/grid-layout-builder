/**
 * Extract a given dom tree into a virtual dom object
 * @param {HTMLElement} domFragment - the parent (inclusive) to replicate to a vDom
 */

export default function domExtractor(domFragment) {
    function render(domElement, vDomObj) {
        if (!domElement) return vDomObj;

        vDomObj = {
            tag: domElement.tagName,
            attributes: {
                class: domElement.classList.value,
            },
            children: Array.prototype.map.call(domElement.children, (child) => {
                return render(child, {});
            }),
        };

        return vDomObj;
    }

    let renderedVDom = render(domFragment, {});

    return renderedVDom;
}
