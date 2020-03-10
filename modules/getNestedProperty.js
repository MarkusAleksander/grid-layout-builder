/**
 * Safely get value of a deeply nested property
 * @param {object} obj - Object to traverse
 * @param {string} propertyPathString - path to traverse represented as a string
 * @param {any} returnIfNotFound - value to return if propertly not found
 */
export default function getNestedProperty(
    obj,
    propertyPathString,
    returnIfNotFound
) {
    // * Split path string
    let properties = propertyPathString.split(".");

    // * Loop over object
    for (let i = 0; i < properties.length; i++) {
        let prop = properties[i];

        if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
            // * Return desired return
            return returnIfNotFound;
        }
        obj = obj[prop];
    }
    // * Return found item
    return obj;
}
