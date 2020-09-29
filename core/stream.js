const {merge, mergeAll} = require("./scope");
const T = require("./types");

if (!global._X_LOOP_BREAK_) {
    global._X_LOOP_BREAK_ = Symbol("BREAK_LOOP");
    global._X_ANY_ = Symbol("ANY");
    global._X_ALL_ = Symbol("ALL");
}

const BREAK = global._X_LOOP_BREAK_;
const ANY = global._X_ANY_;
const ALL = global._X_ALL_;
const NONPROPS = ['__proto__', 'constructor', '__defineGetter__', '__defineSetter__', 'prototype'];

function item(s, i) {
    if (!T.isVal(s)) return undefined;
    if (T.isObj(s)) return s[i]
    if (T.isStr(s)) return s[i]
    if (T.isArr(s)) return s[i]
    else return s.item(i)
}

function contains(s, v, k) {
    if (!T.isArr(s) && T.isObj(s)) return s[k] === v;
    return s.indexOf(v) >= 0;
}

function add(src, ...v) {
    if (T.isArr(src)) {
        ForEach(v, (vi) => src.push(vi))
        // src.push(v);
    } else if (T.isMutableList(src)) {
        src.add(v);
    }
}

function remove(src, ...it) {
    it = FlatMap(it);
    let any = false;
    ForEach(it, (item) => {
        let idx = src.indexOf(item);
        if (idx >= 0) {
            any = true
            src.splice(idx, 1);
        }
    });

    return any;
}

function toggle(src, ...c) {
    if (c.length === 0) return;
    c = FlatMap(c);
    let idx = undefined;
    if (c.length === 1) {
        if (!remove(src, c)) {
            add(src, c[0])
        }
    } else {
        c.push(c[0]);
        let any = false;
        ForEach(src, (cl, i) => {
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
    else if (f instanceof RegExp) return (v) => !T.isObj(v) ? f.test(v.toString()) : false;
    else if (T.isObj(f)) {
        if (Object.keys(f).length === 0) return def;
        return inc ? (v) => objMatchOne(v, f) : (v) => objMatchAll(v, f);
    } else return (v) => v === f;
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

function DeepClone(src, {skips = [], maxLevel = 999} = {}, lvl = 0) {
    if (lvl >= maxLevel) return src;
    let cl = T.isArr(src) ? [] : {};
    for (let k in src) {
        if (src.hasOwnProperty(k)) {
            if (skips && contains(skips, k)) continue;
            let val = src[k];
            if (!T.isPrim(val)) {
                val = DeepClone(val, {skips, maxLevel}, lvl++);
            }
            if (T.isArr(cl)) {
                cl.push(val);
            } else {
                cl[k] = val;
            }
        }
    }
    return cl;
}

function DeepConcat(o1, o2) {
    if (T.isStr(o1)) {
        return o1.concat(o2);
    }
    if (T.isArr(o1)) {
        return o1.concat(o2);
    }
    let d = o1;
    for (let k of Object.keys(o2)) {
        if (T.isArr(o2[k])) {
            if (!T.isVal(o1[k])) o1[k] = [];
            DeepConcat(o1[k], o2[k]);
        } else if (T.isObj(o2[k])) {
            if (!T.isVal(o1[k])) o1[k] = {};
            DeepConcat(o1[k], o2[k])
        } else
            d[k] = o2[k];
    }
    return d
}

function ForRange(src, func, start = 0, end) {
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

function ForEach(src, func) {
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

function ForEachRight(src, func, range = []) {
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

function FirstIndex(src, pred) {
    pred = predicate(pred, () => true);
    let r = -1;
    ForEach(src, function (v, k, i) {
        r = pred(v, k, i);
        if (r === true) {
            r = i;
            return BREAK;
        }
    })
    return r;
}

function First(src, pred) {
    return src[FirstIndex(src, pred)]
}

function StartsWith(src, pred) {
    if (T.isStr(src) && T.isStr(pred)) {
        return src.indexOf(pred) === 0
    }
    pred = predicate(pred, () => true);
    return pred(First(src))
}

function LastIndex(src, pred) {
    pred = predicate(pred, () => true);
    let r = -1;
    ForEachRight(src, function (v, k, i) {
        r = pred(v, k, i);
        if (r === true) {
            r = i;
            return BREAK;
        }
    })
    return r;
}

function Last(src, pred) {
    return src[LastIndex(src, pred)]
}

function EndsWith(src, pred) {
    if (T.isStr(src) && T.isStr(pred)) {
        return src.indexOf(pred) === src.length - pred.length
    }
    pred = predicate(pred, () => true);
    return pred(Last(src))
}

function Reverse(src) {
    if (T.isArr(src)) return src.reverse();
    let rev = "";
    ForEachRight(src, function (it) {
        rev += it;
    });
    return rev;
}

/**
 *
 * @param src
 * @param pred
 * @return {boolean}
 * @constructor
 */
function Any(src, pred) {
    // if (!func){
    //     if (T.isArr(src) || T.isStr(src)) return src.length>0;
    //     return Object.keys(src).length>0;
    // }
    let fn = predicate(pred);
    let r = false;
    ForEach(src, function (v, k, i, src) {
        r = fn(v, k, i, src);
        if (r === true) return BREAK;
    });
    return r;
}

function All(src, func) {
    func = predicate(func, () => true);
    let r = true;
    ForEach(src, function (v, k, i, src) {
        r = func(v, k, i, src);
        if (r === false) return BREAK;
    })
    return r;
}

function filterS(src, pred, right = false, omit = false) {
    pred = predicate(pred, () => true);
    let res = "";
    let loop = right ? ForEachRight : ForEach;
    loop(src, function (v, k, i) {
        if (!pred || pred(v, k, i, src) === omit) res += v;
    });
    return res;
}

function filterO(src, pred, right = false, omit = false) {
    if (T.isArr(pred)) {
        let a = Object.assign({}, pred)
        if (omit) pred = (v, k) => !Any(a, k);
        else pred = (v, k) => Any(a, k);
    } else
        pred = predicate(pred, () => true);
    let res = {};
    let loop = right ? ForEachRight : ForEach;
    // TODO optimize loop
    loop(src, function (v, k, i) {
        if (pred(v, k, i, src) !== omit) res[k] = v;
    });
    return res;
}

function filterA(src, pred, right = false, omit = false) {
    if (T.isArr(pred)) {
        let a = Object.assign([], pred)
        if (omit) pred = (v, k, i) => !Any(a, i);
        else pred = (v, k, i) => Any(a, i);
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
        for (let i = len; i >= 0; i--) {
            const v = src[i]
            if (!pred(v, i, i, src) !== omit) {
                res.push(v);
            }
        }
    }
    return res;
}

function Filter(src, pred, right = false) {
    if (T.isStr(src)) return filterS(src, pred, right);
    if (T.isArr(src) || T.isList(src)) return filterA(src, pred, right);
    return filterO(src, pred, right);
}

function Omit(src, pred, right = false) {
    if (T.isStr(src)) return filterS(src, pred, right, true);
    if (T.isArr(src) || T.isList(src)) return filterA(src, pred, right, true);
    return filterO(src, pred, right, true);
}

function FilterRight(src, pred) {
    return Filter(src, pred, true);
}

function MaxIndex(list, pred) {
    pred = funOrKey(pred);
    let mx;
    let index = -1;
    ForEach(list, function (i, ix) {
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

function Max(list, pred) {
    return list[MaxIndex(list, pred)];
}

function MinIndex(list, pred) {
    pred = funOrKey(pred);
    let mn;
    let index = -1;
    ForEach(list, function (i, ix) {
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

function Min(list, pred) {
    return list[MinIndex(list, pred)];
}

function mapA(src, func, right = false) {
    let res = [];
    let loop = right ? ForEachRight : ForEach;
    loop(src, function (a, i) {
        let r = func(a, i, src);
        if (!T.isUnd(r))
            res.push(r);
    });
    return res;
}

function mapO(src, func, right = false) {
    let res = {};
    let loop = right ? ForEachRight : ForEach;
    loop(src, function (v, k, i) {
        let r = func(v, k, i, src);
        if (!T.isUnd(r))
            res[k] = r
    });
    return res;
}

function Map(src, func, right = false) {
    func = predicate(func, (v) => v);
    if (T.isArr(src)) return mapA(src, func);
    else if (T.isObj(src)) return mapO(src, func);
}

function FlatMap(src, func) {
    let res;
    if (T.isStr(src)) res = ""
    else if (T.isArr(src)) res = []
    else res = {};
    ForEach(src, function (a, i) {
        let f;
        if (!!func) {
            f = func(a, i, src);
        } else {
            if (!T.isArr(res) && T.isObj(res)) {
                f = {};
                f[i] = a;
            } else {
                f = a
            }
        }
        res = DeepConcat(res, f);
    });
    return res;
}

function Reduce(src, func, res = src) {
    if (T.isUnd(func)) {
        func = (rs, v) => rs += v
    }
    ForEach(src, (v, k, src) => {
        res = func(res, v, k, src);
    });
}

function ReduceRight(src, func, res = src) {
    ForEachRight(src, (v, k, src) => {
        res = func(res, v, k, src);
    });
}

function keyValuePairs(object) {
    let entries = [];
    ForEach(object, (v, k) => {
        entries.push(T.dict(k, v));
    });
    return entries;
}

function entries(object) {
    let entries = [];
    ForEach(object, (v, k) => {
        entries.push([k, v]);
    });
    return entries;
}

function translateObject(source, translations) {
    if (T.isArr(translations)) {
        Filter(source, translations);
    }
    const keys = Object.keys(translations);
    let res = Filter(source, keys);
    for (let key of keys) {
        res[translations[key]] = res[key];
        delete res[key];
    }
    return res;
}

function deepMerge(target, src, fields) {
    for (let k of Object.keys(src)) {
        const val = src[k];
        if ((!T.isArr(val)) && T.isObj(val)) {
            if (contains(NONPROPS, k)) continue;
            if (!target.hasOwnProperty(k)) target[k] = {}
            deepMerge(src[k], target[k]);
        } else
            target[k] = src[k]
    }
    return target;
}

function deepMergeAll(...obj) {
    let res = {};
    for (let k of Object.keys(obj)) {
        merge(obj[k], res);
    }
    return res;
}

module.exports = {
    ANY, ALL, BREAK, item, contains, add, remove, toggle, objMatchOne, objMatchAll,
    DeepClone, DeepConcat, ForRange, ForEach, ForEachRight, FirstIndex, First,
    StartsWith, LastIndex, Last, EndsWith, Reverse, Any, All, Filter, FilterRight, Reduce, ReduceRight,
    Map, FlatMap, keyValuePairs, entries, deepMerge, deepMergeAll, MaxIndex, Max, MinIndex, Min,
    translateObject, Omit
}