/**
 * @module
 * @memberOf core
 */

function bodyOf(func) {
    return func.toString().match(/{[\w\W]*}/)[0]
}

/**
 * Check if function bodies are equal
 * @param {Function} f1
 * @param {Function} f2
 * @return {boolean}
 */
function funcBodyEquals(f1, f2) {
    return bodyOf(f1) === bodyOf(f2)
}

/**
 * Throttle function execution.
 * {@link https://css-tricks.com/debouncing-throttling-explained-examples/}
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
 * Debounce function execution.
 * {@link https://css-tricks.com/debouncing-throttling-explained-examples/}
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
 * @param {Function} func - source function
 * @param {any[]} args - array of arguments to bind
 * @return {Function}
 */
function bindArgs(func, args) {
    return function () {return func.apply(this,args)}
}

module.exports = {
    funcBodyEquals,
    throttle,
    debounce
}