require("../njs/xeer-node")

/**
 * Select All elements from query
 * @param qe {String, Element, Node}
 * @param root {Element, Node}
 * @return {NodeList}
 */
X.Q = function (qe, root = document.body) {
    return X.isStr(qe)?root.querySelectorAll(qe):qe;
}
X._defGlobal("Q", X.Q);

/**
 * Select First elements from query
 * @param qe {String, Element, Node}
 * @param root {Element, Node}
 * @return {NodeList}
 */
X.Q1 = function (qe, root = document.body) {
    return X.isStr(qe)?root.querySelector(qe):qe;
}
X._defGlobal("Q1",X.Q1);

/**
 * Get/Set/Delete Attribute
 * @param e {this, Element, Node}
 * @param k {String}
 * @param v {String?}
 * @return {String}
 */
X.attr = function (e, k, v) {
    if (!(v && e.setAttribute(k, v))) {
        if (X.isNull(v))
            e.removeAttribute(k);
        else
            return e.getAttribute(k);
    }
};

/**
 * Helper to manipulate element attributes
 * @param e
 * @return {{set: set, get: (function(*=): string), toggle: toggle, has: (function(*=): boolean)}}
 */
X.attrs = function (e) {
    return {
        has: function (a) {
            return e.hasAttribute(a);
        },
        set: function (a, v) {
            v !== undefined ? e.setAttribute(a, v) : e.removeAttribute(a)
        },
        get: function (a) {
            return e.getAttribute(a)
        },
        toggle: function (a, v) {
            let val = this.get(a);
            if (v) {
                if (Array.isArray(v)) {
                    let cur = v.indexOf(val);
                    if (cur === v.length - 1) cur = 0;
                    else cur++;
                    this.set(a, v[cur]);
                    return
                }
            }
            if (this.has(a)) {
                this.set(a);
            } else {
                this.set(a, v)
            }
        }
    }
};

X.prop = function (e, k, v) {
    if (!(v && (e[k] = v))) return e[k];
};

/**
 * Helper for element/node classes
 * @param e
 * @return {{add: add, _update: (function(*): string), toggle: toggle, has: (function(*=): boolean), value: (String|string), items: (function(): {}|[]|*), remove: remove}}
 */
X.cls = function (e) {
    return {
        value: X.attr(e, 'class') || '',
        _update: function (items) {
            let cls = '';
            for (let i = 0; i < items.length; i++) {
                let v = items[i];
                if (v !== null)
                    cls += (i < items.length - 1) ? (v + ' ') : (v);
            }
            this.value = cls;
            e.setAttribute('class', cls);
            return cls;
        },
        items: function () {
            return this.value.split(' ').Filter((i)=>i!=='');
        },
        has: function (c) {
            return this.items().contains(c);
        },
        add: function (c) {
            if (Array.isArray(c)) {
                for (let i = 0; i < c.length; i++) {
                    this.add(c[i]);
                }
                return
            }
            let it = this.items();
            if (this.has(c)) return;
            it.push(c);
            this._update(it);
        },
        remove: function (c) {
            let it = this.items();
            it.remove(c);
            this._update(it);
        },
        toggle: function (c) {
            if (c===undefined || c === null) return;
            if (!Array.isArray(c)) {
                c = [c];
            }
            if (c.length === 0) return;
            let any;
            let items = this.items();
            for (let i = 0; i < items.length; i++) {
                if (c.length ===1 && items[i] === c[0]) {
                    any = true;
                    items[i]= null;
                    continue;
                }
                for (let j = 0; j < c.length; j++) {
                    if (items[i] === c[j]) {
                        any = true;
                        let cur = j;
                        if (cur === c.length - 1) cur = 0;
                        else cur++;
                        items[i] = c[cur];
                        break
                    }
                }
            }
            if (!any) {
                this.add(c[0]);
            } else
                this._update(items);
        }
    }
};

X.css = function (e, p, v) {
    if (X.isUnd(p)) {
        let stl = {};
        let cs = e.style;
        X.Filter(cs, (s)=>s && cs[s]!=="initial").ForEach((s)=>stl[s] = cs[s]);
        return stl
    }
    if (X.isUnd(v)) return e.style[p] || getComputedStyle(e)[p];
    e.style[p] = v;
};

/**
 * Helper for element/node styles
 * @param e
 * @return {{all: (function(): CSSStyleDeclaration), set: set, get: (function(*): string), del: del, has: (function(*): boolean), unset: unset}}
 */
X.styles = function (e) {
    return {
        all: function () {
            return getComputedStyle(e);
        },
        has: function (s) {
            return (this.all()[s] && true) || false
        },

        set: function (s, v) {
            e.style[s] = v;
        },

        get: function (s) {
            return this.all()[s];
        },

        unset: function (s) {
            this.set(s, 'unset');
        },

        del: function (s) {
            e.style[s] = ''
        }
    }
};

/**
 * Append child(s) and throw event
 * @param e
 * @param c
 * @constructor
 */
X.Append = function (e, c) {
    e.append(c);
}