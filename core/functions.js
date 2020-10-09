function bodyOf(func) {
    return func.toString().match(/{[\w\W]*}/)[0]
}

function funcBodyEquals(f1, f2) {
    return bodyOf(f1) === bodyOf(f2)
}

/**
 * Throttle function execution
 *
 * @param {Function} func - function
 * @param {Number} intervalMs
 * @return {Function} - throttled function
 */
function throttle(func, intervalMs) {
    var ___last___ = new Date().getTime();
    function throttled(args) {
        if (new Date().getTime()-___last___ >= intervalMs) {
            ___last___ = new Date().getTime();
            func.call(this, args);
        }
    }
    return throttled;
}

/**
 * Debounce function
 *
 * @param {Function} func - function
 * @param {Number} afterMs - milliseconds after last call
 * @return {Function} - debounced function
 */
function debounce(func, afterMs) {
    var ___timeout___ = null;

    function caller(_this, args) {
        func.apply(_this, args);
    }

    function flush(args) {
        func(args);
    }

    function debounced(...args) {
        clearTimeout(___timeout___);
        ___timeout___ = setTimeout(caller, afterMs, this, args)
    }

    return debounced
}

/**
 * Bind args to function and return a no-arg function
 * @param {Function} func
 * @param {any[]} args
 */
function bindArgs(func, args) {
    return function () {return func.apply(this,args)}
}

module.exports = {
    funcBodyEquals,
    throttle,
    debounce
}