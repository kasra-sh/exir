require("./scope");
const T = require("./types");
const L = require("./logging");

let S = {};

if (!global._X_LOOP_BREAK_) {
    global._X_LOOP_BREAK_ = Symbol("BREAK_LOOP");
    global._X_ANY_ = Symbol("ANY");
    global._X_ALL_ = Symbol("ALL");
}

S.BREAK = global._X_LOOP_BREAK_;
S.ANY = global._X_ANY_;
S.ALL = global._X_ALL_;

S.item = function item(s, i) {
    if (!T.isVal(s)) return undefined;
    if (T.isObj(s)) return s[i]
    if (T.isStr(s)) return s[i]
    if (T.isArr(s)) return s[i]
    else return s.item(i)
}

S.contains = function contains(s, v, k) {
    if (!T.isArr(s) && T.isObj(s)) return s[k] === v;
    return s.indexOf(v)>=0;
}

S.add = function add(src, ...v) {
    if (T.isArr(src)) {
        S.ForEach(v, (vi)=>src.push(vi))
        // src.push(v);
    } else if (T.isMutableList(src)) {
        src.add(v);
    }
}

S.remove = function remove(src, ...it) {
    it = S.FlatMap(it);
    let any = false;
    S.ForEach(it, (item)=> {
        let idx = src.indexOf(item);
        if (idx>=0) {
            any = true
            src.splice(idx, 1);
        }
    });

    return any;
}

S.toggle = function toggle(src, ...c) {
    if (c.length===0) return;
    c = S.FlatMap(c);
    let idx = undefined;
    if (c.length===1){
        if (!S.remove(src, c)) {
            S.add(src, c[0])
        }
    } else {
        c.push(c[0]);
        let any = false;
        S.ForEach(src, (cl, i)=> {
            idx = c.indexOf(cl);
            if (idx>=0 && c.length>(idx+1)) {
                any = true;
                src[i] = c[idx+1]
            }
        });
        if (!any) {
            src.push(c[0])
        }
    }
}

S.objMatchOne = function objMatchOne(o, match) {
    let m = Object.keys(match);
    for (let k of m) {
        // if (!T.isObj(o[k])) continue;
        if (match[k] === S.ANY && o.hasOwnProperty(k)) return true;
        if (match[k] === o[k]) return true;
    }
    return false
}

S.objMatchAll = function objMatchAll(o, match) {
    let m = Object.keys(match);
    for (let k of m) {
        // if (!T.isObj(o[k])) return false;
        if (match[k] === S.ANY) continue;
        if (match[k] !== o[k]) return false
    }
    return true
}

function funOrEq(f, def, inc = true) {
    if (T.isUnd(f)) return def;
    if (T.isFun(f)) return f;
    else if (f instanceof RegExp) return (v)=>!T.isObj(v)?f.test(v.toString()):false;
    else if (T.isObj(f)) {
        if (Object.keys(f).length===0) return def;
        return inc?(v)=>S.objMatchOne(v, f):(v)=>S.objMatchAll(v, f);
    }
    else return (v)=>v===f;
}

S.DeepClone = function (src, opt={skips:[], maxLevel: 999}, lvl=0) {
    if (lvl>=opt.maxLevel) return src;
    let cl = T.isArr(src)?[]:{};
    for (let k in src) {
        if (src.hasOwnProperty(k)) {
            if (opt.skips && S.contains(opt.skips, k)) continue;
            let val = src[k];
            if (!T.isPrim(val)) {
                val = S.DeepClone(val, opt, lvl++);
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

S.DeepConcat = function (o1, o2) {
    if (T.isStr(o1)) {
        return o1.concat(o2);
    }
    if (T.isArr(o1)) {
        return o1.concat(o2);
    }
    let d = o1;
    for (let k of Object.keys(o2)) {
        if (T.isArr(o2[k])){
            if (!T.isVal(o1[k])) o1[k] = [];
            S.DeepConcat(o1[k], o2[k]);
        } else if(T.isObj(o2[k])) {
            if (!T.isVal(o1[k])) o1[k] = {};
            S.DeepConcat(o1[k], o2[k])
        } else
            d[k] = o2[k];
    }
    return d
}

S.ForRange = function (src, func, start = 0, end) {
    if (!T.isArr(src) || !T.isStr(src)) {
        let keys = Object.keys(src);
        end = end || keys.length -1
        for (let i=start; i<=end; i++) {
            let r = func(src[keys[i]], keys[i], i, src);
            if (r === S.BREAK) return i;
        }
        return end;
    }
    end = end || src.length;
    for (let i = start; i < end; i++) {
        let r = func(S.item(src,i), i, i, src);
        if (r === S.BREAK) return i;
    }
    return end
}

S.ForEach = function (src, func) {
    if (!T.isVal(src)) return -1;
    if (!T.isArr(src) || !T.isStr(src) || !T.isList(src)) {
        let i = 0;
        let keys = Object.keys(src);
        const len = keys.length;
        for (; i<len; i++) {
            // let r = ;
            const k = keys[i], v=src[k];
            if (func(v, k, i, src) === S.BREAK) return i;
        }
        return i;
    }
    const len = src.length;
    if (!T.isArr(src)) {
        for (let i = 0; i < len; i++) {
            const v = src[i];
            let r = func(v, i, i, src);
            if (r === S.BREAK) return i;
        }
    } else {
        for (let i = 0; i < len; i++) {
            const v = S.item(src,i);
            let r = func(v, i, i, src);
            if (r === S.BREAK) return i;
        }
    }
    return src.length
}

S.ForEachRTL = function (src, func, range=[]) {
    if (!T.isArr(src) || !T.isStr(src)) {
        let i = 0;
        let keys = Object.keys(src);
        for (let i=keys.length-1; i>=0; i--) {
            if (i<range[1]) continue;
            if (i>=range[0]) return i;
            let r = func(src[keys[i]], keys[i], i, src);
            if (r === S.BREAK) return i;
        }
        return i;
    }
    for (let i=src.length-1; i>=0; i--) {
        let r = func(S.item(src, i), i, i, src);
        if (r === S.BREAK) return i;
    }
    return src.length
}

S.ArrayForEach = function (src, func) {
    let arr = Array.from(src);
    let rev = S.ForEach(arr, func);
    return rev < arr.length ? arr.slice(0, rev) : arr;
}

S.ArrayForEachRTL = function (src, func) {
    let arr = Array.from(src);
    let rev = S.ForEachRTL(arr, func);
    return rev < arr.length ? arr.slice(0, rev) : arr;
}

S.First = function (src, func) {
    // if (!func) return item(src, 0);
    func = funOrEq(func,()=>true);
    let r;
    S.ForEach(src, function (v,k,i) {
        r = func(v, k, i);
        if (r === true) {
            r = v;
            return S.BREAK;
        }
    })
    return r;
}

S.StartsWith = function(src, func) {
    func = funOrEq(func,()=>true);
    return func(S.First(src))
}

S.Last = function (src, func) {
    // if (!func) return item(src, 0);
    func = funOrEq(func, ()=>true);
    let r;
    S.ForEachRTL(src, function (v,k,i) {
        r = func(v, k, i);
        if (r === true) {
            r = v;
            return S.BREAK;
        }
    })
    return r;
}

S.Reverse = function (src) {
    if (T.isArr(src)) return src.reverse();
    let rev = "";
    S.ForEachRTL(src, function (it) {
        rev+=it;
    });
    return rev;
}

/**
 *
 * @param src
 * @param func
 * @return {boolean}
 * @constructor
 */
S.Any = function (src, func) {
    // if (!func){
    //     if (T.isArr(src) || T.isStr(src)) return src.length>0;
    //     return Object.keys(src).length>0;
    // }
    let fn = funOrEq(func);
    let r = false;
    S.ForEach(src, function (v, k, i, src) {
        r = fn(v, k, i, src);
        if (r === true) return S.BREAK;
    });
    return r;
}

S.All = function (src, func) {
    func = funOrEq(func, ()=>true);
    let r = true;
    S.ForEach(src, function (v, k, i, src) {
        r = func(v, k, i, src);
        if (r === false) return S.BREAK;
    })
    return r;
}

function filterS(src, pred, right = false){
    pred = funOrEq(pred, ()=>true);
    let res = "";
    let loop = right? S.ForEachRTL: S.ForEach;
    loop(src, function (v, k, i) {
        if (!pred || pred(v, k, i, src) === true) res += v;
    });
    return res;
}

function filterO(src, pred, right = false){
    if (T.isArr(pred)) {
        let a = S.DeepClone(pred);
        pred = (v, k, i)=>{
            return S.Any(a, k);
        }
    } else
        pred = funOrEq(pred,  ()=>true);
    let res = {};
    let loop = right? S.ForEachRTL: S.ForEach;
    loop(src, function (v, k, i) {
        if (pred(v, k, i, src) === true) res[k] = v;
    });
    return res;
}

function filterA(src, pred, right= false) {
    if (T.isArr(pred)) {
        let a = S.DeepClone(pred)
        pred = (v, k, i, src)=>S.Any(a, i);
    } else
        pred = funOrEq(pred,  ()=>true);
    let res = [];
    // let loop = right? I.ForEachRTL: I.ForEach;
    const len = src.length;
    if (!right) {
        for (let i = 0; i < len; i++) {
            const v = src[i]
            if (pred(v, i, i, src) === true) {
                res.push(v);
            }
        }
    }else {
        for (let i = len; i >= 0; i--) {
            const v = src[i]
            if (pred(v, i, i, src) === true) {
                res.push(v);
            }
        }
    }

    // loop(src, function (v, k, i) {
    //     if (pred(v, k, i, src) === true) {
    //         res.push(v);
    //     }
    // });
    return res;
}

S.Filter = function (src, pred, right = false) {
    if (T.isStr(src)) return filterS(src, pred, right);
    if (T.isArr(src) || T.isList(src)) return filterA(src, pred, right);
    return filterO(src, pred, right);
};

S.FilterRTL = function (src, func) {
    return S.Filter(src, func, true);
};

function mapA(src, func, right = false) {
    let res = [];
    let loop = right? S.ForEachRTL: S.ForEach;
    loop(src, function (a, i) {
        let r = func(a, i, src);
        if (!T.isUnd(r))
            res.push(r);
    });
    return res;
}

function mapO(src, func, right = false) {
    let res = {};
    let loop = right? S.ForEachRTL: S.ForEach;
    loop(src, function (v, k, i) {
        let r = func(v, k, i, src);
        if (!T.isUnd(r))
            res[k] = r
    });
    return res;
}

S.Map = function (src, func, right = false) {
    func = funOrEq(func,(v)=>v);
    if (T.isArr(src)) return mapA(src, func);
    else if (T.isObj(src)) return mapO(src, func);
}

S.FlatMap = function (src, func) {
    let res;
    if (T.isStr(src)) res = ""
    else if (T.isArr(src)) res = []
    else res = {};
    S.ForEach(src, function (a, i) {
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
        res = S.DeepConcat(res, f);
    });
    return res;
}

S.objectPairs = function (object) {
    let entries = [];
    S.ForEach(object, (v, k)=> {
        entries.push(T.dict(k, v));
    });
    return entries;
}

S.objectEntriesStd = function (object) {
    let entries = [];
    S.ForEach(object, (v, k)=> {
        entries.push([k, v]);
    });
    return entries;
}

S.startsWith = function (str, s) {
    return str.indexOf(s)===0;
}

S.endsWith = function (str, s) {
    return S.Last(str) === s
}

module.exports = S;