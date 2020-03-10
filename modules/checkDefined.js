/**
 * Check if given variable is defined
 * @param {any} val - value to check if defined
 */
export default function checkDefined(val) {
    return typeof val !== "undefined" && val !== null;
}
