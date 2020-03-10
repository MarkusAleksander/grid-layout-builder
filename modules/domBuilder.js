import buildElement from "./buildElement.js";

/**
 * Method to create a dom structure from a virtual representation
 * @param {object} struct - js object representing the dom structure
 * @param {HTMLElement} location - location to append the completed Dom
 */
export default function domBuilder(struct, location) {
    function render(dData) {
        // * Render element
        if (!dData) return undefined;

        let el;

        // * If is a string, append a text node
        if (typeof dData === "string") {
            el = document.createTextNode(dData);
            return el;
        }

        // * Create the dom element
        el = buildElement(dData.tag, {
            attributes: dData.attributes,
            styles: dData.styles,
            events: dData.events,
        });

        // * Loop through any children
        if (Array.isArray(dData.children)) {
            dData.children.forEach((child) => {
                el.appendChild(render(child));
            });
        }

        return el;
    }

    // * Render the dom structure
    let renderedDom = render(struct);

    // * Insert at location if specified
    if (location) {
        location.appendChild(renderedDom);
    }

    Object.defineProperty(renderedDom, "querySelector", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function() {},
    });
    Object.defineProperty(renderedDom, "querySelectorAll", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function() {},
    });

    return renderedDom;
}

// * Example
const domStructure = {
    tag: "div",
    attributes: {
        "class": "root test-item",
        "id": "root",
        "data-test": "content",
        "data-test-1": "content-1",
    },
    styles: {
        width: "75%",
    },
    children: [
        {
            tag: "h1",
            attributes: {
                class: "text",
                id: "",
            },
            styles: {
                color: "#f00",
            },
            children: ["A structure built by JS"],
            events: [
                {
                    click: () => {
                        let target = document.querySelector("p.text");
                        target.changeStyle(
                            "color",
                            "rgb(" +
                                Math.random() * 255 +
                                "," +
                                Math.random() * 255 +
                                "," +
                                Math.random() * 255 +
                                ")"
                        );
                    },
                },
            ],
        },
        {
            tag: "p",
            attributes: {
                class: "text",
                id: "",
            },
            styles: {
                color: "#f00",
            },
            children: [
                "A structure built by JS",
                {
                    tag: "span",
                    children: [" with a span"],
                },
            ],
        },
    ],
};
