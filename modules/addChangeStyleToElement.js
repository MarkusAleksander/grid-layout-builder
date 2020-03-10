/**
 *  Extends the Element object with style change functionality
 */

//  ! Deprecated - Shouldn't change Element prototype
export default function addChangeStyleToElement() {
    /**
     * Change Style on an element
     * @param {string} prop - style property to change
     * @param {string} value - value to change the property to
     */
    Element.prototype.changeStyle = function changeStyle(prop, value) {
        let s = this.style;
        s[prop] = value;
    };
}
