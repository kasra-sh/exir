let T = {};

T.isUnd = function (x) {
    return x!==null && x === undefined;
}

T.isNull = function (x) {
    return x === null;
}

T.isVal = function (x) {
    return !T.isUnd(x) && !T.isNull(x);
}

T.isNum = function (x) {
    return typeof x === "number";
}

T.isStr = function (x) {
    return typeof x === "string" || x instanceof String;
}

T.isFun = function (x) {
    return typeof x === "function";
}

T.isObj = function (x) {
    return typeof x === "object";
}

T.isArr = function (x) {
    return x instanceof Array
}

T.isPrim = function (x) {
    return T.isVal(x) && !T.isObj(x) && !T.isFun(x);
}

T.isList = function (x) {
    return T.isVal(x.length) && T.isFun(x.item)
}

T.isMutableList = function (x) {
    return T.isVal(x.length) && T.isFun(x.item) && T.isFun(x.add)
}

T.isEl = function (x) {
    return x instanceof Element || x instanceof HTMLElement || x instanceof Node;
}

T.isEls = function (x) {
    return x instanceof HTMLCollection || x instanceof NodeList;
}

T.funcEqual = function (f1, f2) {
    return f1.toString().match(/{[\w\W]*}/) === f2.toString().match(/{[\w\W]*}/)
}

T.hasField = function hasField(obj, field, pred) {
    if (!T.isVal(obj)) return undefined;
    if (T.isFun(pred)) {
        return pred(obj[field]);
    }
    return obj.hasOwnProperty(field);
}

T.isEmpty = function (x) {
    if (T.hasField(x, 'length')) return x.length <= 0;
    if (T.isFun(x)) return false;
    if (T.isObj(x)) return Object.keys(x).length <= 0
    return true;
}

/**
 *
 * @param src {Object | String[]}
 * @return {(array)}
 * @constructor
 */
T.Enum = function (src) {
    let c = 0;
    let MAP = {};
    for (let i of Object.keys(src)) {
        MAP[MAP[c] = i] = c++;
    }
    return MAP;
}

T.Set = class {
    items = [];

    constructor(items) {
        this.items = items
    }

    static of(src) {
        return new T.Set(src)
    }

    add(item) {
        if (this.items.indexOf(item)<0) {
            this.items.push(item)
        }
    }

    contains(item) {
        return this.items.indexOf(item)>=0
    }

    remove(item) {
        this.items.splice(this.items.indexOf(item), 1);
    }
}

T.dict = function (...args) {
    let o = {};
    for (let i=0;i<args.length; i++) {
        if (i%2!==0) continue;
        o[args[i]] = args[i+1]
    }
    return o;
}

module.exports = T;