/**
 * Improved version of document.createElement, taking in type and object with options
 * @param {string} elementType - string representing the element type
 * @param {object} options - object of options to add to the element: classes, id, attributes, styles
 */
export default function buildElement(
    elementType,
    { attributes, styles, events }
) {
    // * Create The Element
    let el = document.createElement(elementType);

    // * Add some extra functionality
    el.changeStyle = function changeStyle(prop, value) {
        // * Change a style property
        let s = this.style;
        s[prop] = value;
    };

    el.toggleClass = function toggleClass(className, condition) {
        // * Toggle a class
        let cl = this.classList;
        let cd = condition !== undefined ? condition : true;
        cl.contains(className) && cd ? cl.remove(className) : cl.add(className);
    };

    el.replaceClass = function replaceClass(oldClassName, newClassName) {
        // * Replace classname
        let cl = this.classList;
        cl.remove(oldClassName);
        cl.add(newClassName);
    };

    // * Add any attributes (classes, data attributes)
    if (attributes && typeof attributes === "object") {
        let attrs = Object.keys(attributes);
        attrs.forEach((attr) => {
            el.setAttribute(attr, attributes[attr]);
        });
    }

    // * Add any styles
    if (styles && typeof styles === "object") {
        let s = Object.keys(styles);

        s.forEach((style) => {
            el.changeStyle(style, styles[style]);
        });
    }

    // * Set up any events
    if (events && Array.isArray(events)) {
        events.forEach((eventObj) => {
            let e = Object.keys(eventObj);
            e.forEach((eventType) => {
                el.addEventListener(eventType, eventObj[eventType]);
            });
        });
    }

    // * Return new element
    return el;
}
