/**
 *  Extends the Element object with class toggle functionality
 */
//  ! Deprecated - Shouldn't change Element prototype
export default function addClassToggleToElements() {
    /**
     * Toggle class on element
     * @param {string} className - class to toggle
     */
    Element.prototype.toggleClass = function toggleClass(className) {
        let cl = this.classList;
        cl.contains(className) ? cl.remove(className) : cl.add(className);
    };
}
