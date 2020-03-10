import checkDefined from "./checkDefined";

export default function findUndefinedInArray(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return true;

    return arr.some((el) => {
        return !checkDefined(el);
    });
}
