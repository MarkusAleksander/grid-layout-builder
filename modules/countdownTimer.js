/**
 * Countdown Timer - See README for instructions
 * @param {object} data - object containing data about the timer
 */
function CountdownTimer(data) {
    this._dateEnd = data.dateEnd || 0;
    this._daysAsHours = data.daysAsHours || true;
    this._returnNumbersInSpans = data.returnNumbersInSpans || false;
    this._countdownElement = data.countdownElement || null;
    this._displayAnnotations = data.displayAnnotations || false;
    this._daysHTML = document.createElement("span");
    this._hoursHTML = document.createElement("span");
    this._minutesHTML = document.createElement("span");
    this._secondsHTML = document.createElement("span");
    this._timeLeft = 0;
    this._timeNow = 0;
    this._version = "3.1.0";
    this._d = 1000 * 60 * 60 * 24;
    this._h = 1000 * 60 * 60;
    this._m = 1000 * 60;
    this._timerSet = false;
}
CountdownTimer.prototype._getVersion = function _getVersion() {
    return this._version;
};
CountdownTimer.prototype._initCountdown = function _initCountdown() {
    if (!this._dateEnd || !this._countdownElement) {
        return this;
    }

    this._setupElements();

    this._dateEnd = new Date(this._dateEnd).getTime();
    this._timerSet = true;

    return this;
};
CountdownTimer.prototype._setupElements = function _setupElements() {
    let timerArray = [
        this._daysHTML,
        this._hoursHTML,
        this._minutesHTML,
        this._secondsHTML,
    ];

    timerArray[0].classList.add("countdown__days");
    timerArray[1].classList.add("countdown__hours");
    timerArray[2].classList.add("countdown__minutes");
    timerArray[3].classList.add("countdown__seconds");

    if (this._daysAsHours) {
        timerArray.shift();
    }

    let _self = this;
    timerArray.forEach(function insertTimerEls(tel) {
        _self._countdownElement.insertAdjacentElement("beforeend", tel);
    });
};
CountdownTimer.prototype._isTimerSet = function _isTimerSet() {
    return this._timerSet;
};
CountdownTimer.prototype._startCountdown = function _startCountdown() {
    if (this._isTimerSet()) {
        this._countdownElement.classList.add("countdown__started");
        this._updateCountdown();
    }
};
CountdownTimer.prototype._updateCountdown = function _updateCountdown() {
    this._timeNow = new Date().getTime();
    this._timeLeft = this._dateEnd - this._timeNow;

    if (this._timeLeft < 0) {
        this._countdownElement.innerHTML = "EXPIRED";
        this._timerSet = false;
        this._countdownElement.classList.remove("countdown__started");
        this._countdownElement.classList.add("countdown__expired");
        return;
    }

    if (!this._daysAsHours) {
        let _dv = this._processValue(Math.floor(this._timeLeft / this._d));

        this._daysHTML.innerHTML =
            _dv +
            (this._displayAnnotations
                ? this._calculateAnnotation(_dv, "days")
                : "");
    }
    let _hv = this._daysAsHours
        ? this._processValue(
              Math.floor((this._timeLeft % this._d) / this._h) +
                  Math.floor(this._timeLeft / this._d) * 24
          )
        : this._processValue(Math.floor((this._timeLeft % this._d) / this._h));

    this._hoursHTML.innerHTML =
        _hv +
        (this._displayAnnotations
            ? this._calculateAnnotation(_hv, "hours")
            : "");

    let _mv = this._processValue(
        Math.floor((this._timeLeft % this._h) / this._m)
    );

    this._minutesHTML.innerHTML =
        _mv +
        (this._displayAnnotations
            ? this._calculateAnnotation(_mv, "minutes")
            : "");

    let _sv = this._processValue(Math.floor((this._timeLeft % this._m) / 1000));

    this._secondsHTML.innerHTML =
        _sv +
        (this._displayAnnotations
            ? this._calculateAnnotation(_sv, "seconds")
            : "");

    let _self = this;

    window.setTimeout(_self._updateCountdown.bind(_self), 1000);
};
CountdownTimer.prototype._calculateAnnotation = function _calculateAnnotation(
    value,
    str
) {
    let nStr = str,
        v = Number(value);
    if (isNaN(v)) {
        // * in case something breaks
        return '<span class="countdown__annotation">' + nStr + "</span>";
    }
    if (v === 1) {
        nStr = str.substring(0, str.length - 1);
    }
    return '<span class="countdown__annotation">' + nStr + "</span>";
};
CountdownTimer.prototype._processValue = function _processValue(v) {
    return this._returnNumbersInSpans
        ? this._splitNums(this._strPad(v))
        : this._strPad(v);
};
CountdownTimer.prototype._strPad = function _strPad(n) {
    let numLength = String(n).length,
        lx;

    lx = numLength < 2 ? -2 : numLength * -1;

    return String("0" + n).slice(lx);
};
CountdownTimer.prototype._splitNums = function _splitNums(n) {
    return n
        .split("")
        .map(function createSpan(x) {
            return "<span class='countdown__number'>" + x + "</span>";
        })
        .join("");
};
CountdownTimer.prototype._forEachNode = function _forEachNode(
    nodeList,
    callback
) {
    Array.prototype.forEach.call(nodeList, callback);
};

(function initAction() {
    function ready(fn) {
        if (
            document.attachEvent
                ? document.readyState === "complete"
                : document.readyState !== "loading"
        ) {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
    ready(function run() {
        Array.prototype.forEach.call(
            document.querySelectorAll(
                ".countdown__container:not(.countdown__started)"
            ),
            function forEachCountdownContainer(c) {
                let ctdwn = new CountdownTimer({
                    dateEnd: c.getAttribute("data-countdown"),
                    displayAnnotations: c.getAttribute(
                        "data-display-annotations"
                    ),
                    daysAsHours: c.getAttribute("data-display-days_as_hours"),
                    returnNumbersInSpans: c.getAttribute("data-display-spans"),
                    countdownElement: c,
                })
                    ._initCountdown()
                    ._startCountdown();
            }
        );
    });
})();
