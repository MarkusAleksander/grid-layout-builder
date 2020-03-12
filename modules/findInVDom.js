/**
 *
 * @param {object} vDom - the vDom structure
 * @param {object} toFind - key and value to find {k:v}
 * @param {boolean} mutliple - looking for multiples?
 */

export default function findInVDom(vDom, toFind, mutliple) {
    if (!vDom || typeof vDom !== "object") return null;

    let k = Object.keys(toFind)[0];
    let v = toFind[k];

    if (vDom.attributes[k].includes(v)) {
        return vDom;
    } else if (Array.isArray(vDom.children) && vDom.children.length) {
        let c = vDom.children,
            i = 0,
            l = c.length;

        for (i; i < l; i++) {
            let found = findInVDom(c[i], toFind, mutliple);
            if (found) {
                return c[i];
            }
        }
    }

    return null;
}
