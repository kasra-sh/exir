const {VNode} = require("./vnode")
const {ForEach, contains} = require("../../core/stream");
const T = require("../../core/types");
const {compile} = require("../../template/fmt").Fmt;
const L = require("../../core/logging");
const {$,$$} = require("../../dom");

class ObjPatch {
    /**
     * @param op {'+', '-', '*'} Operation
     * @param tg {'p', 'c', 'a'} Target
     * @param k {String} Key
     * @param v {Object?} Value
     */
    constructor(op, tg, k, v) {
        this.op = op
        this.tg = tg
        this.k = k
        this.v = v
    }
}

/**
 * @deprecated
 */
class View {
    constructor(el) {
        this.root = el;
        this.vroot = VNode.from(el);
    }

    static create = function (e) {
        if ($$(e).length > 1) {
            L.warn(`VDom root query yielded multiple elements, first one is selected!\tVDom.create('${e}')`)
        }
        let el = $$(e);
        if (!T.isEl(el)) {
            L.error(`VDom root invalid or not found!\tVDom.create(${e})`);
            return null;
        }
        return new View(el);
    }
}

/**
 * @deprecated
 * @type {{bindList: ViewBinder.bindList, bindNode: (function(VNode, Object): VNode), _relKey: (function(*, *): *), defineProp: ViewBinder.defineProp, prepareModel: ViewBinder.prepareModel}}
 */
const ViewBinder = {
    _relKey: function (key, root) {
        return root !== "" ? root + "." + key : key
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
    prepareModel: function (obj, root = "") {
        let self = this;
        console.log("PREP MODEL", obj, root);
        let keys = Object.keys(obj);
        for (let k of keys) {
            let ok = obj[k];
            if (!T.isObj(ok) && !T.isFun(ok)) {
                L.error(k);
                this.defineProp(obj, k, root);
            } else if (T.isArr(ok)) {
                L.warn(k);
                ForEach(ok,(o) => this.prepareModel(ok, self._relKey(k, root)));
            } else if (T.isObj(ok)) {
                L.warn(k);
                this.prepareModel(ok, self._relKey(k, root));
            }
        }
    },
    /**
     *
     * @param node {VNode}
     * @param model {Object}
     *
     * @return {VNode}
     */
    bindNode: function (node, model) {
        node.__x__.deps = [];
        if (node.text) {
            let c = compile(node.text);
            if (c.props.length > 0) {
                ForEach(c.props,function (pi) {
                    let prop = c.parts[pi].prop;
                    if (!T.hasField(model, prop)) L.warn(`View property/method is not defined in Model!\t{${prop}}`);
                    node.__x__.deps.push(prop);
                });
            }
        }
        return node
    },

    /**
     * Binds list to model
     *
     * @param parentNode {VNode}
     * @param model {Object}
     * @return {VNode}
     */
    bindList: function (parentNode, model) {
        let xf = parentNode.attrs["x-for"].trim();
        console.log(xf);
    }
}

cmpO = function (o1, o2) {
    let patches = [];
    let k1 = Object.keys(o1);
    let k2 = Object.keys(o2);
    for (let k of k2) {
        if (!contains(k1, k)) {
            patches.push(new ObjPatch('+', 'p', k));
        }
    }
    for (let k of k1) {
        if (!contains(k2, k)) {
            patches.push(new ObjPatch('-', 'p', k));
        } else {
            if (o1[k] !== o2[k]) patches.push(new ObjPatch('*', 'p', k, o2[k]))
        }
    }
    return patches;
};

module.exports = {View, ViewBinder, ObjPatch}