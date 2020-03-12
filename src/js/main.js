import onDomReady from "../../modules/onDomReady.js";
import config from "./config.js";
import generateToolbar from "./toolbar.struct.js";
import generateGridItem from "./gridItem.struct.js";
import domBuilder from "../../modules/domBuilder.js";

onDomReady(main);

function main() {
    // * Get the editable grid
    let editableGrid = document.querySelector(config.target);

    if (!editableGrid) return;

    // * Add a toolbar to the editable grid
    addToolbar(editableGrid);
    // * Create the placeholder to use in the drag drop operations
    createPlaceholder();

    // * Add event listeners to editable grid
    [
        {
            mousemove: onMouseMoveHandler,
        },
        {
            mousedown: onMouseDownHandler,
        },
        {
            mouseup: onMouseUpHandler,
        },
    ].forEach((ev) => {
        let k = Object.keys(ev)[0];
        editableGrid.addEventListener(k, ev[k]);
    });
}

function createPlaceholder() {
    config.placeholder = domBuilder({
        tag: "div",
        attributes: { class: "grid-item--placeholder" },
    });
}
function onMouseDownHandler(e) {
    console.log("Mouse Down");

    if (e.button !== 0) return;

    let target = e.target;

    if (!e.target.classList.contains("grid-item")) return;

    config.currentDragItem = e.target;
    config.isDragging = true;

    let targetBounds = target.getBoundingClientRect();
    let mousePos = getCurrentMousePosition();

    target.classList.add("is-dragging");

    target.style.width = targetBounds.width + "px";
    target.style.height = targetBounds.height + "px";
    target.style.top = mousePos.y - targetBounds.height / 2 + "px";
    target.style.left = mousePos.x - targetBounds.width / 2 + "px";

    insertPlaceholder(target);
}
function onMouseUpHandler(e) {
    console.log("Mouse Up");

    if (e.button !== 0) return;

    let dragItem = config.currentDragItem;

    dragItem.classList.remove("is-dragging");

    dragItem.style.top = "inherit";
    dragItem.style.left = "inherit";

    config.isDragging = false;
    config.currentDragItem = null;

    config.placeholder.insertAdjacentElement("afterend", dragItem);

    removePlaceholder();
}
function onMouseMoveHandler(e) {
    trackMouseInGrid.call(this, e);

    if (!config.isDragging) return;

    // * Update dragged item
    let mousePos = getCurrentMousePosition();
    let dragItem = config.currentDragItem;
    let draggedItem = dragItem.getBoundingClientRect();

    dragItem.style.top = mousePos.y - draggedItem.height / 2 + "px";
    dragItem.style.left = mousePos.x - draggedItem.width / 2 + "px";

    // * Check current target item
    let target = e.target;
    if (target.classList.contains("grid-item")) {
        positionPlaceholder(target);
    }
}

function insertPlaceholder(location) {
    location.insertAdjacentElement("beforebegin", config.placeholder);
}

function removePlaceholder() {
    config.placeholder.remove();
}

function positionPlaceholder(el) {
    let r = config.placeholder.compareDocumentPosition(el),
        relPos = "beforebegin";
    if (r === 2) {
        relPos = "beforebegin";
    }
    if (r === 4) {
        relPos = "afterend";
    }
    el.insertAdjacentElement(relPos, config.placeholder);
}

function trackMouseInGrid(e) {
    let bounds = this.getBoundingClientRect();
    config.mouseX = e.clientX - bounds.x;
    config.mouseY = e.clientY - bounds.y;

    if (config.mouseX < 0) {
        config.mouseX = 0;
    }
    if (config.mouseY < 0) {
        config.mouseY = 0;
    }
    if (config.mouseX > bounds.width) {
        config.mouseX = bounds.width;
    }
    if (config.mouseY > bounds.height) {
        config.mouseY = bounds.height;
    }
}
function getCurrentMousePosition() {
    return {
        x: config.mouseX,
        y: config.mouseY,
    };
}

function addToolbar(DOMRoot) {
    DOMRoot.style.position = "relative";
    config.toolbar = domBuilder(
        generateToolbar(
            addGridItem.bind(null, DOMRoot, "start"),
            removeGridItem.bind(null, DOMRoot, "start"),
            addGridItem.bind(null, DOMRoot, "end"),
            removeGridItem.bind(null, DOMRoot, "end")
        ),
        DOMRoot
    );
}
function addGridItem(DOMRoot, location) {
    let newItem = domBuilder(generateGridItem([`${DOMRoot.children.length}`]));
    if (location === "start") {
        DOMRoot.prepend(newItem);
    } else if (location === "end") {
        DOMRoot.append(newItem);
    }
}
function removeGridItem(DOMRoot, location) {
    let targetItem;
    if (location === "start") {
        targetItem = DOMRoot.firstElementChild;
        if (targetItem && targetItem.classList.contains("grid-toolbar")) {
            targetItem = null;
        }
    } else if (location === "end") {
        targetItem = DOMRoot.lastElementChild;
        if (targetItem && targetItem.classList.contains("grid-toolbar")) {
            targetItem = targetItem.previousElementSibling;
        }
    }

    if (targetItem) {
        targetItem.remove();
    }
}
