/**
 * @module core/collections
 * @memberOf core
 */

const T = require("./types");

if (!global._X_LOOP_BREAK_) {
    global._X_LOOP_BREAK_ = Symbol("BREAK_LOOP");
    global._X_ANY_ = Symbol("ANY");
    global._X_ALL_ = Symbol("ALL");
}
/**
 * Break from functional loops: forEach, filter, ...
 * @type {symbol}
 */
const BREAK = global._X_LOOP_BREAK_;
/**
 * Match Any: Used as value in predicate object
 * @type {symbol}
 */
const ANY = global._X_ANY_;
const ALL = global._X_ALL_;
const UNSAFE_PROPS = ['__proto__', 'constructor', '__defineGetter__', '__defineSetter__', 'prototype'];

/**
 * Get item by index from multiple source types
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} s - source
 * @param {Number|String} i - item index
 * @returns {any|null|undefined}
 */
function item(s, i) {
    if (!T.isVal(s)) return undefined;
    if (T.isObj(s)) return s[i]
    if (T.isStr(s)) return s[i]
    if (T.isArr(s)) return s[i]
    else return s.item(i)
}

/**
 * Source contains value or key:value
 *
 * @param {Array|Object|String} src
 * @param {any} value
 * @param {String|undefined} [key]
 * @returns {boolean}
 */
function contains(src, value, key) {
    if (!T.isVal(src)) return false;
    if (!T.isArr(src) && T.isObj(src)) return src[key] === value;
    return src.indexOf(value) >= 0;
}

/**
 * Add item(s) to source
 *
 * @param {Array|{add:Function}} src - source
 * @param {any} v - values
 */
function add(src, ...v) {
    if (T.isArr(src)) {
        forEach(v, (vi) => src.push(vi))
    } else if (T.isMutableList(src)) {
        src.add(v);
    }
}

/**
 * Remove item(s) from source
 *
 * @param {Array|String} src
 * @param {...any} it
 * @returns {boolean}
 */
function remove(src, ...it) {
    it = flatMap(it);
    let any = false;
    forEach(it, (item) => {
        let idx = src.indexOf(item);
        if (idx >= 0) {
            any = true
            src.splice(idx, 1);
        }
    });

    return any;
}

/**
 * Toggles items in source
 *
 * @param {Array} src
 * @param {...any} c
 */
function toggle(src, ...c) {
    if (c.length === 0) return;
    c = flatMap(c);
    let idx = undefined;
    if (c.length === 1) {
        if (!remove(src, c)) {
            add(src, c[0])
        }
    } else {
        c.push(c[0]);
        let any = false;
        forEach(src, (cl, i) => {
            idx = c.indexOf(cl);
            if (idx >= 0 && c.length > (idx + 1)) {
                any = true;
                src[i] = c[idx + 1]
            }
        });
        if (!any) {
            src.push(c[0])
        }
    }
}

function objMatchOne(o, match) {
    let m = Object.keys(match);
    for (let k of m) {
        // if (!T.isObj(o[k])) continue;
        if (match[k] === ANY && o.hasOwnProperty(k)) return true;
        if (match[k] === o[k]) return true;
    }
    return false
}

function objMatchAll(o, match) {
    let m = Object.keys(match);
    for (let k of m) {
        // if (!T.isObj(o[k])) return false;
        if (match[k] === ANY) continue;
        if (match[k] !== o[k]) return false
    }
    return true
}

function predicate(f, def = () => true, inc = true) {
    if (T.isUnd(f)) return def;
    if (T.isFun(f)) return f;
    else if (f instanceof RegExp) return (v, k, i, s) => !T.isObj(v) ? f.test(v.toString()) : false;
    else if (T.isObj(f)) {
        if (Object.keys(f).length === 0) return def;
        return inc ? (v, k, i, s) => objMatchOne(v, f) : (v, k, i, s) => objMatchAll(v, f);
    } else return (v, k, i, s) => v === f;
}

function funOrKey(f) {
    if (T.isUnd(f)) return (v) => v;
    if (T.isFun(f)) return f;
    if (T.isStr(f)) {
        const key = f;
        f = (v) => v[key];
    }
    throw Error(`Predicate ${f} cannot be of type ${typeof f}`)
}

/**
 * Create empty instance of given source
 *
 * @param {any} src - source object
 * @param {any} def - default value for primitives
 * @returns {any} empty instance of src
 */
function emptyOf(src, def = {}) {
    if (T.isStr(src)) return "";
    if (T.isList(src)) return [];
    if (T.isObj(src)) {
        if (T.isEl(src)) {
            if (src.nodeType === 3 || src.nodeType === 8) {
                return document.createTextNode(src.textContent);
            } else {
                return document.createElement(src.tagName);
            }
        }
        if (src.__proto__)
            return Object.create(src.__proto__);
        return {};
    }
    return def
}

/**
 * Type-agnostic concat. !!Mutates target!!
 *
 * @param {Array|String|Object} target
 * @param {Array|String|Object} source
 * @returns {Array|String|Object}
 */
function concat(target, source, override=false) {
    if (T.isStr(target)) {
        return target.concat(source);
    }
    if (T.isArr(target)) {
        return target.concat(source);
    }

    for (let k of Object.keys(source)) {
        if (!target[k] || override)
            target[k] = source[k];
    }
    return target
}

/**
 * Polyfill-like for Object.values (uses native method if available)
 *
 * @param {Object} obj
 * @returns {Array|undefined} - array of values
 */
function objectValues(obj) {
    if (Object.values) {
        return Object.values(obj);
    } else {
        return map(obj, (v)=>v)
    }
}

/**
 * Index for loop from "init" to "finish"(included) by "step"
 *
 * @param {Function} func
 * @param {Number} init
 * @param {Number} finish
 * @param {Number} [step]
 */
function forN(func, init=0, finish=0, step=init<finish?1:-1) {
    if (step>0) {
        for (; init<=finish; init+=step) {
            func(init)
        }
    }
    for (; init>=finish; init+=step) {
        func(init)
    }
}

/**
 * forEach(left) with limited range
 *
 * @param {Array|Object|NodeList|HTMLCollection} src
 * @param {Function} func
 * @param {Number} [start]
 * @param {Number?} [end]
 * @returns {*|number}
 */
function forEachRange(src, func, start = 0, end) {
    if (!T.isArr(src) || !T.isStr(src)) {
        let keys = Object.keys(src);
        end = end || keys.length - 1
        for (let i = start; i <= end; i++) {
            let r = func(src[keys[i]], keys[i], i, src);
            if (r === BREAK) return i;
        }
        return end;
    }
    end = end || src.length;
    for (let i = start; i < end; i++) {
        let r = func(item(src, i), i, i, src);
        if (r === BREAK) return i;
    }
    return end
}

/**
 * Type-agnostic forEach loop
 *
 * @param src
 * @param func
 * @returns {number|*}
 */
function forEach(src, func) {
    if (!T.isVal(src)) return -1;
    if (!T.isArr(src) || !T.isStr(src) || !T.isList(src)) {
        let i = 0;
        let keys = Object.keys(src);
        const len = keys.length;
        for (; i < len; i++) {
            // let r = ;
            const k = keys[i], v = src[k];
            if (func(v, k, i, src) === BREAK) return i;
        }
        return i;
    }
    const len = src.length;
    if (!T.isArr(src)) {
        for (let i = 0; i < len; i++) {
            const v = src[i];
            let r = func(v, i, i, src);
            if (r === BREAK) return i;
        }
    } else {
        for (let i = 0; i < len; i++) {
            const v = item(src, i);
            let r = func(v, i, i, src);
            if (r === BREAK) return i;
        }
    }
    return src.length
}

/**
 * Type-agnostic forEachRight loop
 *
 * @param src
 * @param func
 * @param range
 * @returns {number|*}
 */
function forEachRight(src, func, range = []) {
    if (!T.isArr(src) || !T.isStr(src)) {
        let i = 0;
        let keys = Object.keys(src);
        for (let i = keys.length - 1; i >= 0; i--) {
            if (i < range[1]) continue;
            if (i >= range[0]) return i;
            let r = func(src[keys[i]], keys[i], i, src);
            if (r === BREAK) return i;
        }
        return i;
    }
    for (let i = src.length - 1; i >= 0; i--) {
        let r = func(item(src, i), i, i, src);
        if (r === BREAK) return i;
    }
    return src.length
}

/**
 * Extended version of native indexOf method, using {@link forEach}
 * @see forEach
 * @param {Array|Object|String|NodeList|HTMLCollection} src
 * @param {Function|Object|Array} pred - predicate function/{key:value}/[keys]
 * @returns {number}
 */
function firstIndex(src, pred) {
    pred = predicate(pred, () => true);
    let r = -1;
    forEach(src, function (v, k, i) {
        r = pred(v, k, i, src);
        if (r === true) {
            r = i;
            return BREAK;
        }
    })
    return r;
}

/**
 * Extended version of native first method, using {@link firstIndex}
 * @see firstIndex
 * @param {Array|Object|String|NodeList|HTMLCollection} src
 * @param {Function|Object|Array} [pred] - predicate function/{key:value}/[keys]
 * @returns {*}
 */
function first(src, pred) {
    return item(src, firstIndex(src, pred))
}

/**
 * Returns true if first item matches predicate
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src
 * @param {Function|Object|Array} [pred] - predicate function/{key:value}/[keys] pred
 * @returns {boolean|*}
 */
function startsWith(src, pred) {
    if (T.isStr(src) && T.isStr(pred)) {
        return src.indexOf(pred) === 0
    }
    pred = predicate(pred, () => true);
    return pred(first(src))
}

/**
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src
 * @param {Function|Array|Object} pred
 * @returns {number}
 */
function lastIndex(src, pred) {
    pred = predicate(pred, () => true);
    let r = -1;
    forEachRight(src, function (v, k, i) {
        r = pred(v, k, i);
        if (r === true) {
            r = i;
            return BREAK;
        }
    })
    return r;
}

/**
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src
 * @param {Function|Array|Object} [pred]
 * @returns {*}
 */
function last(src, pred) {
    return src[lastIndex(src, pred)]
}

/**
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src
 * @param {Function|Array|Object} pred
 * @returns {boolean|*}
 */
function endsWith(src, pred) {
    if (T.isStr(src) && T.isStr(pred)) {
        return src.indexOf(pred) === src.length - pred.length
    }
    pred = predicate(pred, () => true);
    return pred(last(src))
}

/**
 * Reverse array-like src
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src
 * @returns {Array|Object|String|NodeList|HTMLCollection} - reversed src
 */
function reverse(src) {
    if (T.isArr(src)) return src.reverse();
    let rev = "";
    forEachRight(src, function (it) {
        rev += it;
    });
    return rev;
}

/**
 * A more versatile alternative to native "some" method
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src
 * @param {Function|Array|Object} pred
 * @returns {boolean}
 */
function any(src, pred) {
    // if (!func){
    //     if (T.isArr(src) || T.isStr(src)) return src.length>0;
    //     return Object.keys(src).length>0;
    // }
    let fn = predicate(pred);
    let r = false;
    forEach(src, function (v, k, i, src) {
        r = fn(v, k, i, src);
        if (r === true) return BREAK;
    });
    return r;
}

/**
 * A more versatile alternative to native "every" method
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src
 * @param {Function|Array|Object} pred
 * @returns {boolean}
 */
function all(src, pred) {
    pred = predicate(pred, () => true);
    let r = true;
    forEach(src, function (v, k, i, src) {
        r = pred(v, k, i, src);
        if (r === false) return BREAK;
    })
    return r;
}

function filterStr(src, pred, right = false, omit = false) {
    pred = predicate(pred, () => true);
    let res = "";
    let loop = right ? forEachRight : forEach;
    loop(src, function (v, k, i) {
        if (!pred || pred(v, k, i, src) === omit) res += v;
    });
    return res;
}

function filterObj(src, pred, right = false, omit = false) {
    if (T.isArr(pred)) {
        let a = Object.assign({}, pred)
        if (omit) pred = (v, k) => !any(a, k);
        else pred = (v, k) => any(a, k);
    } else
        pred = predicate(pred, () => true);
    let res = {};
    // let loop = right ? ForEachRight : ForEach;
    const keys = Object.keys(src);
    const len = keys.length;

    if (!right) {
        for (let i = 0; i < len; i++) {
            const k = keys[i]
            const v = src[k]
            if (pred(v, k, i, src) !== omit) res[k] = v;
        }
    } else {
        for (let i = len-1; i >=0; i--) {
            const k = keys[i]
            const v = src[k]
            if (pred(v, k, i, src) !== omit) res[k] = v;
        }
    }

    // loop(src, function (v, k, i) {
    //     if (pred(v, k, i, src) !== omit) res[k] = v;
    // });
    return res;
}

function filterArr(src, pred, right = false, omit = false) {
    if (T.isArr(pred)) {
        let a = Object.assign([], pred)
        if (omit) pred = (v, k, i) => !any(a, i);
        else pred = (v, k, i) => any(a, i);
    } else
        pred = predicate(pred, () => true);
    let res = [];
    const len = src.length;
    if (!right) {
        for (let i = 0; i < len; i++) {
            const v = src[i]
            if (pred(v, i, i, src) !== omit) {
                res.push(v);
            }
        }
    } else {
        for (let i = len - 1; i >= 0; i--) {
            const v = src[i]
            if (!pred(v, i, i, src) !== omit) {
                res.push(v);
            }
        }
    }
    return res;
}

/**
 * A more versatile alternative to native "filter" method
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src - source
 * @param {Function|Array|Object} pred - predicate function/{key:value}/[keys]
 * @param {boolean} [right] - reverse loop
 * @returns {Array|Object|String}
 */
function filter(src, pred, right = false) {
    if (T.isStr(src)) return filterStr(src, pred, right);
    if (T.isArr(src) || T.isList(src)) return filterArr(src, pred, right);
    return filterObj(src, pred, right);
}

/**
 * Opposite of filter, returns items not matching predicate
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src - source
 * @param {Function|Array|Object} pred - predicate function/{key:value}/[keys]
 * @param {boolean} [right] - reverse loop
 * @returns {Array|Object|String}
 */
function omit(src, pred, right = false) {
    if (T.isStr(src)) return filterStr(src, pred, right, true);
    if (T.isArr(src) || T.isList(src)) return filterArr(src, pred, right, true);
    return filterObj(src, pred, right, true);
}

/**
 * {@link filter} in reverse order (right)
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src - source
 * @param {Function|Array|Object} pred - predicate function/{key:value}/[keys]
 * @returns {Array|Object|String}
 */
function filterRight(src, pred) {
    return filter(src, pred, true);
}

/**
 * Find max index
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} list
 * @param {Function|String} pred - predicate function/key
 * @return {number}
 */
function maxIndex(list, pred) {
    pred = funOrKey(pred);
    let mx;
    let index = -1;
    forEach(list, function (i, ix) {
        let x = pred(i, ix);
        if (!mx) {
            mx = x;
            index = ix;
        } else if (x >= mx) {
            mx = x;
            index = ix;
        }
    });
    return index;
}

/**
 * Find max
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} list
 * @param {Function|String} pred - predicate function/key
 * @return {number}
 */
function max(list, pred) {
    return list[maxIndex(list, pred)];
}

/**
 * Find min index
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} list
 * @param {Function|String} pred - predicate function/key
 * @return {number}
 */
function minIndex(list, pred) {
    pred = funOrKey(pred);
    let mn;
    let index = -1;
    forEach(list, function (i, ix) {
        let x = pred(i, ix);
        if (!mn) {
            mn = x;
            index = ix;
        } else if (x <= mn) {
            mn = x;
            index = ix;
        }
    });
    return index;
}

/**
 * Find min
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} list
 * @param {Function|String} pred - predicate function/key
 * @return {number}
 */
function min(list, pred) {
    return list[minIndex(list, pred)];
}

function mapArr(src, func, right = false) {
    let res = [];
    // let loop = right ? ForEachRight : ForEach;
    const len = src.length;
    if (!right) {
        for (let i=0; i<len; i++) {
            let r = func(src[i], i, src);
            if (r === BREAK) break;
            if (!T.isUnd(r))
                res.push(r);
        }
    } else {
        for (let i=len; i>=0; i--) {
            let r = func(src[i], i, src);
            if (r === BREAK) break;
            if (!T.isUnd(r))
                res.push(r);
        }
    }
    // loop(src, function (a, i) {
    //     let r = func(a, i, src);
    //     if (!T.isUnd(r))
    //         res.push(r);
    // });
    return res;
}

function mapObj(src, func, right = false) {
    let res = {};
    // let loop = right ? ForEachRight : ForEach;
    const keys = Object.keys(src);
    const len = src.length;
    if (!right) {
        for (let i=0; i<len; i++) {
            const k = keys[i];
            const v = src[k];
            let r = func(v, k, i, src);
            if (r === BREAK) break;
            if (!T.isUnd(r))
                res[k] = r
        }
    } else {
        for (let i=len; i>=0; i--) {

            const k = keys[i];
            const v = src[k];
            let r = func(v, k, i, src);
            if (r === BREAK) break;
            if (!T.isUnd(r))
                res[k] = r
        }
    }
    // loop(src, function (v, k, i) {
    //     let r = func(v, k, i, src);
    //     if (!T.isUnd(r))
    //         res[k] = r
    // });
    return res;
}

/**
 * A more versatile alternative to native "map" method
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src - source
 * @param {Function|Array|Object} transform - transformer function
 * @param {boolean} [right] - reverse loop
 * @returns {Array|Object|String}
 */
function map(src, transform, right = false) {
    transform = predicate(transform, (v) => v);
    if (T.isArr(src)) return mapArr(src, transform, right);
    else if (T.isObj(src)) return mapObj(src, transform, right);
}

/**
 * A more versatile alternative to native "flatMap" method, flattens first level items
 *
 * @param {Array|Object|String|NodeList|HTMLCollection} src - source
 * @param {Function|Array|Object} [transform] - transformer function
 * @returns {Array|Object|String}
 */
function flatMap(src, transform) {
    let res;
    if (T.isStr(src)) res = ""
    else if (T.isArr(src)) res = []
    else res = {};
    forEach(src, function (a, i) {
        let f;
        if (!!transform) {
            f = transform(a, i, src);
        } else {
            if (!T.isArr(res) && T.isObj(res)) {
                f = {};
                f[i] = a;
            } else {
                f = a
            }
        }
        res = concat(res, f);
    });
    return res;
}

/**
 * A more versatile alternative to native "reduce" method
 *
 * @param {any} src - source
 * @param {Function|Array|Object} func - reducer function
 * @param {any} [acc] - accumulator
 * @returns {any}
 */
function reduce(src, func, acc = src) {
    if (T.isUnd(func)) {
        func = (rs, v) => rs + v
    }
    forEach(src, (v, k, src) => {
        acc = func(acc, v, k, src);
    });
    return acc
}

/**
 * {@link reduce} in reverse
 * @see reduce
 * @param {any} src - source
 * @param {Function|Array|Object} func - reducer function
 * @param {any} [acc] - accumulator
 * @returns {any}
 */
function reduceRight(src, func, acc = src) {
    forEachRight(src, (v, k, src) => {
        acc = func(acc, v, k, src);
    });
}

/**
 * Randomly shuffle array's items
 * @param {ArrayLike} arrayLike
 */
function shuffle(arrayLike) {
    return Array.prototype.sort.call(arrayLike, ()=>Math.random()-0.5)
}

/**
 * Sort array ascending with optional field parameter
 * @param {ArrayLike} arrayLike
 * @param {Function} [fieldFn]
 * @param {String} [locale]
 */
function sortAsc(arrayLike, fieldFn, locale='en') {
    let compare = fieldFn?function (a,b){
        return (''+fieldFn(a)).localeCompare(''+fieldFn(b),locale)
    }:undefined
    return Array.prototype.sort.call(arrayLike, compare)
}

/**
 * Sort array descending with optional field parameter
 * @param {ArrayLike} arrayLike
 * @param {Function} [fieldFn]
 * @param {String} [locale]
 */
function sortDesc(arrayLike, fieldFn, locale='en') {
    let compare = fieldFn?function (a,b){
        return (''+fieldFn(b)).localeCompare(''+fieldFn(a),locale)
    }:undefined
    return Array.prototype.sort.call(arrayLike, compare)
}

/**
 * Extract single key-value pairs from object
 *
 * @param object
 * @return {Object[]}
 */
function keyValuePairs(object) {
    let entries = [];
    forEach(object, (v, k) => {
        entries.push(T.dict(k, v));
    });
    return entries;
}

/**
 * Like Object.entries extracts key-value pairs as [[key1,value1],[key2,value2],...]
 *
 * @param {Object} object
 * @return {Array[]}
 */
function entries(object) {
    let entries = [];
    forEach(object, (v, k) => {
        entries.push([k, v]);
    });
    return entries;
}

/**
 * Translate(rename) object fields using dict parameter, omitting undefined keys
 * @param {Object} source
 * @param {Object|Array} dict
 * @return {Array|Object|String}
 */
function translateObject(source, dict) {
    if (T.isArr(dict)) {
        filter(source, dict);
    }
    const keys = Object.keys(dict);
    let res = filter(source, keys);
    for (let key of keys) {
        res[dict[key]] = res[key];
        delete res[key];
    }
    return res;
}

/**
 * Recursive deep merge {@param target} with {@param source}
 *
 * @param {Object|Array} target
 * @param {Object|Array} source
 * @param {Array} excludeKeys - keys to be skipped while merging
 * @param maxDepth - maximum recursive depth
 * @param allowUnsafeProps - allow unsafe properties like __proto__
 * @return {Object|Array}
 */
function deepMerge(target,
                   source,
                   {
                       excludeKeys = [],
                       maxDepth = 999,
                       allowUnsafeProps = false
                   } = {excludeKeys: [], maxDepth: 999, allowUnsafeProps: false},
                   depth = 0) {
    if (depth >= maxDepth) return target;
    forEach(source, (v, k) => {
        if (excludeKeys && contains(excludeKeys, k)) return;
        if (allowUnsafeProps && contains(UNSAFE_PROPS, k)) return;
        if (T.isObj(source[k])) {
            target[k] = deepMerge(emptyOf(source[k]), source[k], {excludeKeys, maxDepth, depth: depth + 1});
        } else
            target[k] = v
    });
    return target;
}

/**
 * Recursive deep clone {@param source}
 * @see deepMerge
 *
 * @param {Object|Array} source
 * @param {Array} excludeKeys - keys to be skipped while merging
 * @param {Number} [maxDepth] - maximum recursive depth
 * @param {boolean} [allowUnsafeProps] - allow unsafe properties like __proto__
 * @return {Object|Array}
 */
function deepClone(source,
                   {
                       excludeKeys = [],
                       maxDepth = 999,
                       allowUnsafeProps = false
                   } = {excludeKeys: [], maxDepth: 999, allowUnsafeProps: false},) {
    return deepMerge(emptyOf(source), source, {excludeKeys, maxDepth, allowUnsafeProps})
}

function _keyGen(key, fnName) {
    let keyGen = key
    if (T.isStr(key)) {
        keyGen = (item)=> item[key]
    } else if (T.isArr(key)) {
        keyGen = (item) => reduce(item, (res, v, k)=> {
            if (contains(key, k)) {
                return res + v;
            }
        }, "")
    } else if (!T.isFun(key)) {
        throw Error(`${fnName} key only accepts: String, [String,...], Function`)
    }
    return keyGen;
}

/**
 * Join arrays of objects based on a generated or static key
 *
 * @param {Function|String} key
 * @param {Object[]} lists
 * @return {Object}
 */
function join(key, ...lists) {
    if (lists.length === 0) return [];
    if (!all(lists, T.isArr)) throw Error("Join only accepts arrays of data!");
    let keyGen = _keyGen(key, "Join")
    const joined = {};
    forEach(lists, (list)=>{
        forEach(list, (item) => {
            const joinKey = keyGen(item);
            const presentValue = joined[joinKey];
            if (!presentValue) {
                joined[joinKey] = item;
            } else {
                joined[joinKey] = concat(presentValue, item)
            }
        });
    })

    return (joined)

}

/**
 * Group arrays based on generated or static key(s)
 *
 * @param {Function|String} key
 * @param {Object[]} lists
 * @return {Object}
 */
function groupBy(key, ...lists) {
    if (lists.length === 0) return {};
    if (!all(lists, T.isArr)) throw Error("GroupBy only accepts arrays of data!");
    let keyGen = _keyGen(key, "GroupBy")
    const group = {};
    forEach(lists, (list)=>{
        forEach(list, (item) => {
            const joinKey = keyGen(item);
            const presentValue = group[joinKey];
            if (!presentValue) {
                group[joinKey] = [item];
            } else {
                group[joinKey] = concat(presentValue, item)
            }
        });
    })

    return (group)

}

// noinspection JSUnusedGlobalSymbols
module.exports = {
    ANY, ALL, BREAK, item, contains, add, remove, toggle, concat, emptyOf, objMatchOne, objMatchAll,
    deepMerge, deepClone, forN, forEachRange, forEach, forEachRight, firstIndex, first,
    startsWith, lastIndex, last, endsWith, reverse, any, all, filter, filterRight, reduce, reduceRight,
    map, flatMap, keyValuePairs, entries, maxIndex, max, minIndex, min, shuffle, sortAsc, sortDesc,
    translateObject, omit, join, groupBy, objectValues
}