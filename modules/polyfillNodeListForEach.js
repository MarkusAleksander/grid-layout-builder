/**
 *  Ensure Nodelists have the foreach function available (for IE11)
 */

//  ! DEPRECATED - SHOULDN'T ALTER PROTOTYPE OF NODELIST WITH ARRAY FUNCTIONALITY
export default function polyfillNodeListForEach() {
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
}
