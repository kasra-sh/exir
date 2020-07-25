require("../base");
require("../prototypes");
require("./fmt");

X.VNode = class {
    tag = '#TEXT';
    nodes = [];
    constructor(el) {
        if (X.isVal(el.id) && el.id.trim() !== "") {
            this.id = el.id;
        }
        if (X.isVal(el.tagName)) {
            this.tag = el.nodeName
        }
        if (el.nodeType === 3) {
            this.text = el.nodeValue;
            if (this.text.trim() === "") this.tag = null;
            return;
        }

        if (el.tagName && el.attributes.length>1 || el.attributes.length>0) {
            this.attrs = {};
            let atrs = this.attrs;
            X.ForEach(el.attributes, function (kv) {
                if (kv.name === "id") return;
                atrs[kv.name] = kv.value;
            });
        }
        if (this.attrs && this.attrs["class"])
            this.cls = el.cls().items();

        for (let k in el) {
            if (!el.hasOwnProperty(k)) continue;
            this.props || (this.props = {});
            this.props[k] = el[k]
        }

        this.relQuery = X.queryOf(el, el.parentElement);
        let nds = this.nodes;
        X.ForEach(el.childNodes, function (nd) {
            if (nd.nodeType === 8) return;
            let vnd = new X.VNode(nd);
            if (X.isNull(vnd.tag)) return;
            nds.push(vnd);
        });
        if (this.nodes[0] && this.nodes[0].tag === "#TEXT") {
            this.text = this.nodes[0].text
        }
    }

    buildElement() {
        if (this.tag === "#TEXT") {
            return X.$DOC.createTextNode(this.text);
        }

        let e = X.$DOC.createElement(this.tag);
        this.id && (e.id = this.id);
        this.attrs && this.attrs.ForEach(function (a, i, atr) {
            e.setAttribute(a, atr[a]);
        });
        this.props && this.props.ForEach(function (p, i, prp) {
            e[p] = prp[p];
        });
        this.nodes.ForEach(function (n) {
            X.Append(e, n.buildElement());
        });
        return e
    }
}

X.ObjPatch = class {
    /**
     * @param op {'+', '-', '*'} Operation
     * @param tg {p, c, a} Target
     * @param k {String} Key
     * @param v {Object} Value
     */
    constructor(op, tg, k, v) {
        this.op = op
        this.tg = tg
        this.k = k
        this.v = v
    }
}

X.View = class {
    constructor(el) {
        this.root = el;
        this.vroot = new X.VNode(el);
    }
    static create = function (e) {
        if (X.Q(e).length>1) {
            X.warn(`VDom root query yielded multiple elements, first one is selected!\tVDom.create('${e}')`)
        }
        let el = X.Q1(e);
        if (!X.isEl(el)) {
            X.error(`VDom root invalid or not found!\tVDom.create(${e})`);
            return null;
        }
        return new X.View(el);
    }
}

X.ViewBinder = {
    _relKey: function (key, root){
        return root!==""?root+"."+key: key
    },
    defineProp: function (obj, key, root) {
        let self = this;
        let pv = obj[key];
        Object.defineProperty(obj, key, {
            set: function (v) {
                this["$_" + key] = v;
                window.dispatchEvent(new CustomEvent("model.setval", {detail: {targetKey: self._relKey(key, root)}}));
            },
            get: function () {
                return this["$_" + key]
            }
        });
        obj[key] = pv;
    },
    /**
     *
     * @param obj {Object}
     * @param root {String}
     */
    prepareModel: function (obj, root="") {
        let self = this;
        console.log("PREP MODEL",obj, root);
        let keys = Object.keys(obj);
        for (let k of keys) {
            let ok = obj[k];
            if (!X.isObj(ok) && !X.isFun(ok)) {
                console.error(k);
                this.defineProp(obj, k, root);
            } else if (X.isArr(ok)) {
                console.warn(k);
                ok.ForEach((o)=>this.prepareModel(ok, self._relKey(k, root)));
            } else if (X.isObj(ok)) {
                console.warn(k);
                this.prepareModel(ok, self._relKey(k, root));
            }
        }
    },
    /**
     *
     * @param node {X.VNode}
     * @param model {Object}
     *
     * @return {X.VNode}
     */
    bindNode: function(node, model) {
        node.__dep__ = [];
        if (node.text) {
            let c = X.compileFmt(node.text);
            if (c.props.length>0) {
                c.props.forEach(function (pi) {
                    let prop = c.parts[pi].prop;
                    if (!X.hasProp(model, prop)) X.warn(`View property/method is not defined in Model!\t{${prop}}`);
                    node.__dep__.push(prop);
                });
            }
        }
        return node
    },

    /**
     * Binds list to model
     *
     * @param parentNode {X.VNode}
     * @param model {Object}
     * @return {X.VNode}
     */
    bindList: function (parentNode, model) {
        let xf = parentNode.attrs["x-for"].trim();
        console.log(xf);
    }
}

X.cmpO = function (o1,o2) {
    let patches = [];
    let k1 = Object.keys(o1);
    let k2 = Object.keys(o2);
    for (let k of k2) {
        if (!k1.contains(k)) {
            patches.push(new X.Patch('+', 'p', k));
        }
    }
    for (let k of k1) {
        if (!k2.contains(k)) {
            patches.push(new X.Patch('-', 'p', k));
        } else {
            if (o1[k]!==o2[k]) patches.push(new X.Patch('*', 'p', k, o2[k]))
        }
    }
    return patches;
};
