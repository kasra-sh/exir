/**
 * @module core/types
 * @memberOf core
 */

/**
 * If is class or function return class/function name else returns typeof
 * @param x
 * @return {"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"|*}
 */
function typeName(x) {
    if (x.hasOwnProperty('constructor')) {
        return x.constructor.name;
    }
    return typeof x;
}

/** Is undefined
 * @param x
 * @returns {boolean}
 */
function isUnd(x) {
    return x !== null && x === undefined;
}

/** Is null
 * @param x
 * @return {boolean}
 */
function isNull(x) {
    return x === null;
}

/** Is value !null && !undefined
 * @param x
 * @return {boolean|boolean}
 */
function isVal(x) {
    return !isUnd(x) && !isNull(x);
}

/** Is number
 * @param x
 * @return {boolean}
 */
function isNum(x) {
    return typeof x === "number";
}

/** Is string|String
 * @param x
 * @return {boolean}
 */
function isStr(x) {
    return typeof x === "string" || x instanceof String;
}

/** Is function
 * @param x
 * @return {boolean}
 */
function isFun(x) {
    return typeof x === "function";
}

/** Is object
 * @param x
 * @return {boolean|boolean}
 */
function isObj(x) {
    return x !== null && typeof x === "object";
}

/** Is Array
 * @param x
 * @return {boolean}
 */
function isArr(x) {
    return x instanceof Array
}

/** Is primitive isVal && !isObj && !isFun
 * @param x
 * @return {boolean}
 */
function isPrim(x) {
    return isVal(x) && !isObj(x) && !isFun(x) || typeof x === 'symbol';
}

/** Is List (has length property and item() function)
 * @param x
 * @return {boolean|boolean}
 */
function isList(x) {
    return isVal(x.length) && isFun(x.item)
}

/** Is MutableList (has length property, item() and add() functions)
 * @param x
 * @return {boolean}
 */
function isMutableList(x) {
    return isVal(x.length) && isFun(x.item) && isFun(x.add)
}

/** Is Set type
 * @param x
 * @return {boolean}
 */
function isSet(x) {
    return x instanceof Set
}

/** Is Map type
 * @param x
 * @return {boolean}
 */
function isMap(x) {
    return x instanceof Map
}

/** Is Error type
 * @param x
 * @return {boolean}
 */
function isError(x) {
    return x instanceof Error
}

/** Is Element/Node
 * @param x
 * @return {boolean}
 */
function isEl(x) {
    return x instanceof Element || x instanceof HTMLElement || x instanceof Node;
}

/** Is NodeList || HTMLCollection
 * @param x
 * @return {boolean}
 */
function isEls(x) {
    return x instanceof HTMLCollection || x instanceof NodeList;
}

/**
 * Object has field
 * @param {Object} obj - source object
 * @param {String} field - field/property name
 * @param {Function} [pred] - optional predicate function to check field
 * @return {boolean}
 */
function hasField(obj, field, pred) {
    if (!isVal(obj)) return false;
    if (isFun(pred)) {
        return pred(obj[field]);
    }
    return obj.hasOwnProperty(field);
}

/** Is Empty Array/List/Object/String
 * @param x
 * @return {boolean}
 */
function isEmpty(x) {
    if (hasField(x, 'length')) return x.length <= 0;
    if (isFun(x)) return false;
    if (isObj(x)) return Object.keys(x).length <= 0
    return true;
}

/**
 * Custom Enum implementation
 *
 * @param src {Object | String[]}
 * @return {Object}
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

/**
 * Deserialize sequence of key values (key, value, ...) into an object
 *
 * @param {any} args - key{String}, value{*} sequence
 * @return {Object}
 */
function dict(...args) {
    let o = {};
    for (let i = 0; i < args.length; i++) {
        if (i % 2 !== 0) continue;
        o[args[i]] = args[i + 1]
    }
    return o;
}

module.exports = {
    typeName,
    isUnd, isNull, isVal,
    isNum, isStr, isFun,
    isObj, isArr, isPrim,
    isList, isMutableList,
    isSet,isMap, isError,
    isEl, isEls, hasField,
    isEmpty, Enum, dict
};