function bodyOf(func) {
    return func.toString().match(/{[\w\W]*}/)[0]
}

function funcBodyEquals(f1, f2) {
    return bodyOf(f1) === bodyOf(f2)
}

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

module.exports = {
    funcBodyEquals,
    throttle,
    debounce
}