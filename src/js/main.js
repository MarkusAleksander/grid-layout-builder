import onDomReady from "../../modules/onDomReady.js";
import config from "./config.js";
import toolbar from "./toolbar.struct.js";
import gridItem from "./gridItem.struct.js";
import placeholder from "./placeholder.struct.js";
import domBuilder from "../../modules/domBuilder.js";
import formatNumber from "../../modules/formatNumber.js";

// * Run on DOM Load
onDomReady(main);

// * Main Entry point
function main() {
    // * Get the editable grid
    let editableGrid = document.querySelector(config.target);

    // * Return if no grid
    if (!editableGrid) return;

    config.DOMGrid = editableGrid;

    // * Add a toolbar to the editable grid
    addToolbarToGrid(editableGrid);

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

    generateVGrid();
}

// * ----- Placeholder Management ------ * //
function createPlaceholder() {
    let dragItemStyles = getComputedStyle(config.currentDragItem);

    // * Create the placeholder element

    return domBuilder(
        placeholder({
            "grid-row-end": dragItemStyles.gridRowEnd,
            "grid-column-end": dragItemStyles.gridColumnEnd,
        })
    );
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
    config.placeholder = null;
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

    let target = e.target;
    if (!e.target.classList.contains("grid-item")) return;

    this.classList.add("is-dragging-active");
    let dragItem = trackGrabbedGridItem(e.target);

    let dragItemStyle = dragItem.style;
    let targetBounds = target.getBoundingClientRect();
    dragItemStyle.width = targetBounds.width + "px";
    dragItemStyle.height = targetBounds.height + "px";

    setGrabbedGridItemStylePosition();

    config.currentDragItem.classList.add("is-dragging");

    // * Create the placeholder to use in the drag drop operations
    config.placeholder = createPlaceholder();

    positionPlaceholder(target);
}
function onMouseUpHandler(e) {
    if (e.button !== 0 || !config.isDragging) return;

    this.classList.remove("is-dragging-active");
    placeGrabbedGridItem(config.placeholder, "afterend");
    config.currentDragItem.classList.remove("is-dragging");
    untrackGrabbedGridtItem();

    removePlaceholder();
    fillVGrid();
}
function onMouseMoveHandler(e) {
    trackMouseInGrid.call(this, e);

    if (!config.isDragging) return;

    // * Update dragged item
    setGrabbedGridItemStylePosition();

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

    return config.currentDragItem;
}
function untrackGrabbedGridtItem() {
    config.isDragging = false;
    config.currentDragItem.style = config.currentDragItemStyle;
    config.currentDragItemStyle = null;
    config.currentDragItem = null;
}
function setGrabbedGridItemStylePosition() {
    let dragItem = config.currentDragItem;
    let dragItemBounds = dragItem.getBoundingClientRect();
    let mousePos = getCurrentMousePosition();
    dragItem.style.top = mousePos.y - dragItemBounds.height / 2 + "px";
    dragItem.style.left = mousePos.x - dragItemBounds.width / 2 + "px";
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

// * ------ Layout grid ------ * //

function getNumGridRows() {
    return getComputedStyle(config.DOMGrid).gridTemplateRows.split(" ").length;
}
function getNumGridCols() {
    return getComputedStyle(config.DOMGrid).gridTemplateColumns.split(" ")
        .length;
}

function fillVGrid() {
    clearVGrid();
    let gridItems = config.DOMGrid.querySelectorAll(".grid-item");

    let i = 0,
        l = gridItems.length;

    for (i; i < l; i++) {
        let gridItem = gridItems[i];

        // * Start positions
        let colStart = calcColStart(gridItem.offsetLeft);
        let rowStart = calcRowStart(gridItem.offsetTop);

        // * Span size
        let s = getComputedStyle(gridItem);
        let colSpan = formatNumber(s.gridColumnEnd);
        let rowSpan = formatNumber(s.gridRowEnd);

        if (!colSpan) {
            colSpan = calcColSpan(gridItem.clientWidth);
        }
        if (!rowSpan) {
            rowSpan = calcRowSpan(gridItem.clientHeight);
        }

        let r = rowStart;

        for (r; r < rowStart + rowSpan; r++) {
            let c = colStart;
            for (c; c < colStart + colSpan; c++) {
                config.VGrid[r][c] = "O";
            }
        }
    }
    console.table(config.VGrid);
}

function clearVGrid() {
    let i = 0;
    let l = config.VGrid.length;
    for (i; i < l; i++) {
        let j = 0;
        let jl = config.VGrid[i].length;
        for (j; j < jl; j++) {
            config.VGrid[i][j] = "X";
        }
    }
}

function generateVGrid() {
    config.nRows = getNumGridRows();
    config.nCols = getNumGridCols();

    config.VGrid = Array(config.nRows);

    let i = 0;
    let l = config.VGrid.length;
    for (i; i < l; i++) {
        config.VGrid[i] = Array(config.nCols);
    }

    fillVGrid();
}

function calcRowSpan(height) {
    let containerHeight = config.DOMGrid.clientHeight;
    return Math.floor(height / (containerHeight / config.nRows));
}
function calcRowStart(height) {
    let containerHeight = config.DOMGrid.clientHeight;
    return Math.floor(height / (containerHeight / config.nRows));
}
function calcColSpan(width) {
    let containerWidth = config.DOMGrid.clientWidth;
    return Math.floor(width / (containerWidth / config.nCols));
}
function calcColStart(width) {
    let containerWidth = config.DOMGrid.clientWidth;
    return Math.floor(width / (containerWidth / config.nCols));
}
