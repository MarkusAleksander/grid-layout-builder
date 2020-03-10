/**
 * Extract a numerical value from a string
 * @param {number} str - string containing number to extract
 * @param {any} returnIfNaN - value to return if NaN
 */
const formatNumber = function formatNumber(str, returnIfNaN = false) {
    if (!str || (typeof str !== "string" && !(str instanceof String))) {
        return returnIfNaN;
    }

    let n = parseFloat(str.toString().replace(/[^0-9.]+/g, ""), 10);

    if (isNaN(n)) {
        return returnIfNaN;
    }
    return n;
};

export default formatNumber;
