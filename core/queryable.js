const T = require("./types");

class Queryable {
    constructor() {
        this.__src__ = undefined
        this.keys = undefined
    }

    get count() {
        return this.keys.length
    }

    static of(s) {
        let c = new Queryable();
        c.__src__ = s;
        c.keys = Object.keys(s);
        c.len = c.keys.length;
        return c
    }

    slice(start = 0, end = this.count-1) {
        this.keys = this.keys.slice(start, end);
    }

    key(i=0) {
        return this.keys[i]
    }

    value(i = 0) {
        return this.__src__[this.key(i)]
    }
    loop(f, reverse = false) {
        if (reverse) {
            for (let i=this.count-1; i>=0; i--) {
                if (f(this.value(i), this.key(i), i) === null) break;
            }
        } else {
            for (let i=0; i<this.count; i++) {
                if (f(this.value(i), this.key(i), i) === null) break;
            }
        }
        return this;
    }
    values(reverse = false) {
        let vs = [];
        this.loop(function (v, k, i) {
            vs.push(v)
        }, reverse);
        return vs;
    }

    item(i) {
        if (i === undefined) return undefined;
        if (T.isArr(this.__src__)) return this.value(i);
        let o = {};
        o[this.key(i)] = this.value(i);
        return o;
    }

    asObject() {
        // if (T.isArr(this.__src__)) return this.values();
        let o = {};
        this.loop(function (v, k, i) {
            o[k] = v
        })
        return o;
    }

    asArray(reverse = false) {
        return this.values(reverse)
    }

    filter(f, reverse = false) {
        let nk = [];
        this.loop(function (v, k, i) {
            let r = f(v, k, i);
            if (r === true) {
                nk.push(k);
            } else if (r === null) return null;
        }, reverse);
        this.keys = nk;
        return this;
    }

    map(f, reverse = false) {
        let arr = []
        this.loop(function (v, k, i) {
            arr.push(f(v, k, i));
        }, reverse)
        return arr;
    }

    any(f) {
        let r = false;
        this.loop(function (v, k, i) {
            r = f(v, k, i);
            if (r === true) {
                return null;
            }
        });
        return r;
    }

    all(f) {
        let r = true;
        this.loop(function (v, k, i) {
            r = f(v, k, i);
            if (r === false) {
                return null;
            }
        });
        return r;
    }

    first(f) {
        if (!f) { return this.item(0) }
        let it;
        this.loop(function (v, k, i) {
            if (f(v, k, i) === true) {
                it = i;
                return null;
            }
        });
        return this.item(it);
    }

    last(f) {
        if (!f) { return this.item(this.count-1) }
        let it;
        this.loop(function (v, k, i) {
            if (f(v, k, i) === true) {
                it = i;
                return null;
            }
        }, true);
        return this.item(it);
    }
}

module.exports = {Queryable};