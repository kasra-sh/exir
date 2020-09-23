function isUnd(x) {
    return x !== null && x === undefined;
}

function isNull(x) {
    return x === null;
}

function isVal(x) {
    return !isUnd(x) && !isNull(x);
}

function isNum(x) {
    return typeof x === "number";
}

function isStr(x) {
    return typeof x === "string" || x instanceof String;
}

function isFun(x) {
    return typeof x === "function";
}

function isObj(x) {
    return typeof x === "object";
}

function isArr(x) {
    return x instanceof Array
}

function isPrim(x) {
    return isVal(x) && !isObj(x) && !isFun(x);
}

function isList(x) {
    return isVal(x.length) && isFun(x.item)
}

function isMutableList(x) {
    return isVal(x.length) && isFun(x.item) && isFun(x.add)
}

function isEl(x) {
    return x instanceof Element || x instanceof HTMLElement || x instanceof Node;
}

function isEls(x) {
    return x instanceof HTMLCollection || x instanceof NodeList;
}

function hasField(obj, field, pred) {
    if (!isVal(obj)) return undefined;
    if (isFun(pred)) {
        return pred(obj[field]);
    }
    return obj.hasOwnProperty(field);
}

function isEmpty(x) {
    if (hasField(x, 'length')) return x.length <= 0;
    if (isFun(x)) return false;
    if (isObj(x)) return Object.keys(x).length <= 0
    return true;
}

/**
 *
 * @param src {Object | String[]}
 * @return {(array)}
 * @constructor
 */
function Enum(src) {
    let c = 0;
    let MAP = {};
    for (let i of Object.keys(src)) {
        MAP[MAP[c] = i] = c++;
    }
    return MAP;
}

class Set {
    items = [];

    constructor(items) {
        this.items = items
    }

    static of(src) {
        return new Set(src)
    }

    add(item) {
        if (this.items.indexOf(item) < 0) {
            this.items.push(item)
        }
    }

    contains(item) {
        return this.items.indexOf(item) >= 0
    }

    remove(item) {
        this.items.splice(this.items.indexOf(item), 1);
    }
}

function dict(...args) {
    let o = {};
    for (let i = 0; i < args.length; i++) {
        if (i % 2 !== 0) continue;
        o[args[i]] = args[i + 1]
    }
    return o;
}

module.exports = {
    isUnd, isNull, isVal,
    isNum, isStr, isFun,
    isObj, isArr, isPrim,
    isList, isMutableList,
    isEl, isEls, hasField,
    isEmpty, Enum, Set, dict
};