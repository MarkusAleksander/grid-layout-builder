import onDomReady from "../../modules/onDomReady.js";
import config from "./config.js";
import generateToolbar from "./toolbar.struct.js";
import generateGridItem from "./gridItem.struct.js";
import domBuilder from "../../modules/domBuilder.js";
import debounce from "../../modules/debounce.js";

onDomReady(main);

function main() {
    let DOMGridRoot = document.querySelector(config.target);

    if (!DOMGridRoot) return;

    addToolbar(DOMGridRoot);
    setItemsDraggable(DOMGridRoot);
    setDropzones(DOMGridRoot.children);
    createDropPlaceholder();
}

function createDropPlaceholder() {
    config.placeholderEl = domBuilder({
        tag: "div",
        attributes: { class: "grid-item--placeholder" },
    });
}

function setDropzone(DOMGridRoot) {
    DOMGridRoot.addEventListener(
        "dragover",
        debounce(onDragOverHandler, 50, true)
    );
    DOMGridRoot.addEventListener("drop", onDropHandler);
}

function setDropzones(DOMGridItems) {
    let i = 0,
        l = DOMGridItems.length;
    for (i; i < l; i++) {
        DOMGridItems[i].addEventListener(
            "dragover",
            debounce(onDragOverHandler, 50, true)
        );
    }
}

function onDragOverHandler(e) {
    e.preventDefault();
    config.previousDragOverTarget = config.currentDragOverTarget;
    config.currentDragOverTarget = e.target;

    if (config.previousDragOverTarget === config.currentDragOverTarget) return;

    config.currentDragOverTarget.insertAdjacentElement(
        "beforebegin",
        config.placeholderEl
    );

    console.log(e.target);
}
function onDropHandler(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    let el = document.querySelector('[data-draggable="' + data + '"]');
    config.placeholderEl.remove();
    e.target.insertAdjacentElement("afterend", el);
}

function setItemsDraggable(DOMGridRoot) {
    let c = DOMGridRoot.children,
        l = c.length,
        i = 0;
    for (i; i < l; i++) {
        let cc = c[i];

        cc.setAttribute("draggable", true);
        cc.setAttribute("data-draggable", i);
        cc.style.backgroundColor =
            "rgb(" +
            (Math.random() * (255 - 0) + 0) +
            "," +
            (Math.random() * (255 - 0) + 0) +
            "," +
            (Math.random() * (255 - 0) + 0) +
            ")";
        cc.addEventListener("dragstart", onDragStartHandler);
        cc.addEventListener("dragend", onDragEndHandler);
    }
}
function onDragEndHandler(e) {
    config.placeholderEl.remove();
}
function onDragStartHandler(e) {
    e.dataTransfer.setData(
        "text/plain",
        e.target.getAttribute("data-draggable")
    );
    e.dataTransfer.dropEffect = "move";
}
function addToolbar(DOMRoot) {
    DOMRoot.style.position = "relative";
    domBuilder(
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
