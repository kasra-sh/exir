/**
 * @module
 * @memberOf core
 */

function bodyOf(func) {
    let match = func.toString().match(/{[\w\W]*}/)
    return match===null?func.toString():match[0]
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

    function debounced(...args) {
        clearTimeout(___timeout___);
        ___timeout___ = setTimeout(function (_this) {
            return func.apply(_this, args)
        }, afterMs, this)

    }

    debounced.flush = function (...args) {
        clearTimeout(___timeout___)
        return func.apply(this, args)
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

function once(func) {
    var called = false
    return function () {
        if (!called) {
            called = true
            return func.apply(this, arguments)
        }
    }
}
module.exports = {
    funcBodyEquals,
    throttle,
    debounce,
    bindArgs,
    once
}