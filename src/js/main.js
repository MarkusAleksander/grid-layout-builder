import onDomReady from "../../modules/onDomReady.js";
import config from "./config.js";
import generateToolbar from "./toolbar.struct.js";
import domBuilder from "../../modules/domBuilder.js";
import domExtractor from "../../modules/domExtractor.js";
import findNestedPropertyByValue from "../../modules/findNestedPropertyByValue.js";

onDomReady(main);

function main() {
    let grids = document.querySelectorAll(config.target);
    let vGrids = [];

    if (!grids.length) return;

    let editableGrids = Array.prototype.filter.call(grids, (grid) => {
        return grid.classList.contains("grid-editable");
    });

    editableGrids.forEach((v, idx) => {
        makeGridEditable(v, idx, vGrids);
    });
}

function makeGridEditable(grid, idx, vGrids) {
    grid.style.position = "relative";

    vGrids.push(domExtractor(grid));

    const toolbar = domBuilder(
        generateToolbar(
            idx,
            addGridItem.bind(null, vGrids[idx]),
            removeGridItem.bind(null, vGrids[idx])
        ),
        grid
    );
}

// function vDomQuerySelector() {}
// function vDomQuerySelectorAll() {}

function addGridItem(grid) {
    console.log(grid);
    debugger;
    findNestedPropertyByValue(grid, "div", null);
}
function removeGridItem(grid) {
    console.log(grid);
}
