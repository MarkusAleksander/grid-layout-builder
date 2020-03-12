/**
 * Search an object by checking for value and return the found objecy
 */
// ! NOT READY FOR USE - MUCH TO DO
export default function findNestedPropertyByValue(
    obj,
    valueToFind,
    returnIfNotFound
) {
    let arrayable = obj;
    let found = returnIfNotFound;

    if (!Array.isArray(obj) && typeof obj === "object") {
        arrayable = Object.values(obj);
    } else if (typeof obj !== "object") {
        return null;
    }

    let i = 0;
    for (i; i < arrayable.length; i++) {
        if (arrayable[i] === valueToFind) {
            found = { i: arrayable[i] };
            break;
        }
        if (Array.isArray(arrayable[i]) || typeof arrayable[i] === "object") {
            let result = findNestedPropertyByValue(
                arrayable[i],
                valueToFind,
                returnIfNotFound
            );
            if (result && result !== returnIfNotFound) {
                found = result;
                break;
            }
        }
    }

    return found;
}
