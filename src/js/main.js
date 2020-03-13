import onDomReady from "../../modules/onDomReady.js";
import config from "./config.js";
import toolbar from "./toolbar.struct.js";
import gridItem from "./gridItem.struct.js";
import placeholder from "./placeholder.struct.js";
import domBuilder from "../../modules/domBuilder.js";

// * Run on DOM Load
onDomReady(main);

// * Main Entry point
function main() {
    // * Get the editable grid
    let editableGrid = document.querySelector(config.target);

    // * Return if no grid
    if (!editableGrid) return;

    // * Add a toolbar to the editable grid
    addToolbarToGrid(editableGrid);

    // * Create the placeholder to use in the drag drop operations
    config.placeholder = createPlaceholder();

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
        editableGrid.addEventListener(k, ev[k].bind(editableGrid));
    });
}

// * ----- Placeholder Management ------ * //
function createPlaceholder() {
    // * Create the placeholder element
    return domBuilder(placeholder());
}
function positionPlaceholder(location) {
    // * Compare position of placeholder to new location and insert accordingly
    let r = config.placeholder.compareDocumentPosition(location),
        relPos = "beforebegin";
    if (r === 2) {
        relPos = "beforebegin";
    }
    if (r === 4) {
        relPos = "afterend";
    }
    location.insertAdjacentElement(relPos, config.placeholder);
}
function removePlaceholder() {
    // * Remove the placeholder from the DOM
    config.placeholder.remove();
}

// * ----- Toolbar Management ------- * //
function addToolbarToGrid(DOMRoot) {
    // * Create a toolbar and add to the grid
    DOMRoot.style.position = "relative";
    config.toolbar = domBuilder(
        toolbar(
            addGridItem.bind(null, DOMRoot, "start"),
            removeGridItem.bind(null, DOMRoot, "start"),
            addGridItem.bind(null, DOMRoot, "end"),
            removeGridItem.bind(null, DOMRoot, "end")
        ),
        DOMRoot
    );
}

// * ----- Mouse Action Management ------- * //
function onMouseDownHandler(e) {
    if (e.button !== 0) return;

    this.classList.add("is-dragging-active");
    let target = e.target;
    if (!e.target.classList.contains("grid-item")) return;

    trackGrabbedGridItem(e.target);

    let targetBounds = target.getBoundingClientRect();
    let mousePos = getCurrentMousePosition();

    let dragItem = config.currentDragItem;

    dragItem.classList.add("is-dragging");

    let dragItemStyle = dragItem.style;

    dragItemStyle.width = targetBounds.width + "px";
    dragItemStyle.height = targetBounds.height + "px";
    dragItemStyle.top = mousePos.y - targetBounds.height / 2 + "px";
    dragItemStyle.left = mousePos.x - targetBounds.width / 2 + "px";

    positionPlaceholder(target);
}
function onMouseUpHandler(e) {
    if (e.button !== 0) return;

    this.classList.remove("is-dragging-active");

    let dragItem = config.currentDragItem;

    dragItem.classList.remove("is-dragging");

    placeGrabbedGridItem(config.placeholder, "afterend");
    untrackGrabbedGridtItem();

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

function placeGrabbedGridItem(location, relPos) {
    location.insertAdjacentElement(relPos, config.currentDragItem);
}

function trackGrabbedGridItem(target) {
    config.currentDragItem = target;
    config.currentDragItemStyle = target.style.cssText;
    config.isDragging = true;
}
function untrackGrabbedGridtItem() {
    config.isDragging = false;
    config.currentDragItem.style = config.currentDragItemStyle;
    config.currentDragItemStyle = null;
    config.currentDragItem = null;
}

// * ----- Grid Item Management ----- * //
function addGridItem(DOMRoot, location) {
    let newItem = domBuilder(gridItem([`${DOMRoot.children.length}`]));
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
