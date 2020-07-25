require("../scope");
require("./logging");
require("./types");

String.prototype.item = Array.prototype.item = function (i) {
    return this[i];
};
String.prototype.replaceAll = function (sr, re) {
    return this.replace(new RegExp(sr, "g"), re)
}

X.Concat = function (o1, o2) {
    if (X.isStr(o1)) {
        return o1.concat(o2);
    }
    if (X.isArr(o1)) {
        return o1.concat(o2);
    }
    let d = o1.clone ? o1.clone() : o1;
    for (let k in o2) {
        if (o2.hasOwnProperty(k)) {
            d[k] = o2[k];
        }
    }
    return d
};

X.ForEach = function (src, func) {
    if (!src.length) {
        let i = 0;
        for (let k in src) {
            if (src.hasOwnProperty(k)) {
                let r = func(src[k], k, src);
                if (r === null) return i;
            }
        }
        return;
    }
    for (let i = 0; i < src.length; i++) {
        let r = func(src.item(i), i, src);
        if (r === null) return i;
    }
    return src.length
};

X.ForEachReverse = function (src, func) {
    if (!src.length) {
        X.ForEach(src, func);
        return;
    }
    for (let i = src.length; i >= 0; i--) {
        let r = func(src.item(i), i, src);
        if (r === null) return i;
    }
    return src.length
};


X.LoopArray = function (src, func) {
    let arr = Array.from(src);
    let rev = X.ForEach(arr, func);
    return rev < arr.length ? arr.slice(0, rev) : arr;
};

X.First = function (src, func) {
    for (let i = 0; i < src.length; i++) {
        let r = func(src.item(i), i, src);
        if (r) return src.item(i);
    }
};

X.Last = function (src, func) {
    for (let i = src.length - 1; i >= 0; i--) {
        let r = func(src.item(i), i, src);
        if (r) return src.item(i);
    }
};

X.Reverse = function (src) {
    if (X.isStr(src)) return src.reverse();
    let rev = [];
    X.ForEachReverse(src, function (it) {
        rev.push(it);
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
X.Any = function (src, func) {
    for (let i = 0; i < src.length; i++) {
        let r = func(src.item(i), i, src);
        if (r === true) return true;
    }
    return false;
};

X.All = function (src, func) {
    for (let i = 0; i < src.length; i++) {
        let r = func(src.item(i), i, src);
        if (r === false) return false;
    }
    return true;
};

X.Filter = function (src, func) {
    let o = false;
    if (!X.isArr(src)) {
        o = true;
    }
    let res = o ? {} : [];
    X.ForEach(src, function (a, i) {
        if (func(a, i, src) === true) {
            if (o) res[a] = src[a];
            else res.push(a);
        }
    });
    return res;
}

X.Map = function (src, func) {
    let res = [];
    X.ForEach(src, function (a, i) {
        res.push(func(a, i, src));
    });
    return res;
}

X.FlatMap = function (src, func) {
    let res = {};
    if (X.isArr(src)) res = [];
    if (X.isStr(src)) res = "";
    X.ForEach(src, function (a, i) {
        let f = func(a, i, src);
        res = X.Concat(res, f);
    });
    return res;
}

X.Measure = function (f, name = "") {
    setTimeout(() => {
        let t = Date.now();
        f();
        console.log(`${name} Finished in ${Date.now() - t}ms`);
    }, 0);
}

X.TaskResult = class {
    constructor(task) {
        this.then = function (f) {
            task.success = f;
            return this;
        };
        this.progress = function (f) {
            task.progress = f;
            return this;
        }
        this.fail = function (f) {
            task.error = f;
            return this;
        }
    }
};

X.RunTask = function (f) {
    let task = this;
    task.success = undefined;
    task.error = undefined;
    setTimeout((t) => {
        try {
            X.isFun(t.success) && t.success(f(t.progress));
        } catch (e) {
            X.isFun(t.error) && t.error(e);
        }
    }, 0, task);
    return new X.TaskResult(task);
}