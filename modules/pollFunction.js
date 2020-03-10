/**
 * Poll for the truthyness of a function and run callback when true
 * @param {function} tfn - function to run to test - must return a boolean
 * @param {function} cb - callback to fire when obj is found
 * @param {number} pollInterval - time interval between polls
 * @param {number} pollLimit - how many times to poll before giving up
 */
export default function pollFunction(
    tfn,
    cb,
    pollInterval = 5,
    pollLimit = 10
) {
    let x = 0;

    let timeout = function timeout() {
        window.setTimeout(doPoll, pollInterval);
    };

    let doPoll = function doPoll() {
        let r = tfn();

        if (r) {
            cb();
        } else if (!r && x++ < pollLimit) {
            timeout();
        }
    };
    timeout();
}
