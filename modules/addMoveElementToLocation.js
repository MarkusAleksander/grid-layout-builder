import selectorExists from "./selectorExists.js";

/**
 *  Extends the Element object with a move to location function
 */
//  ! Deprecated - Shouldn't change Element prototype
export default function addMoveElementToLocation() {
    /**
     * Move element to a specified location
     * @param {Element}  location - element on the page that this will be moved relative to
     * @param {string} relPos - relative position this will be moved to around the location element
     */
    Element.prototype.moveElementToLocation = function moveElementToLocation(
        location,
        relPos
    ) {
        if (!selectorExists(location)) return;

        location.insertAdjacentElement(relPos, this);
    };
}
