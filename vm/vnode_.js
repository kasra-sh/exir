const {filter, forEach, map} = require("../core/collections");
const {isNull, isStr, isArr, isVal, isFun} = require("../core/types");
const {kebab} = require("../core/cases");
const {$$} = require("../dom/query");
const {cls} = require("../dom/classes");
const {append} = require("../dom/append");


/**
 * @property tag
 * @property id
 * @property cls
 * @property attrs
 * @property props
 * @property text
 * @property nodes
 * @deprecated
 */
class Vnode_ {
    constructor(tag = '#TEXT') {
        this.tag = tag
        this.isRef = isFun(tag);
        this.props = {};
        this.nodes = [];
        this.attrs = {};
    }

    get isText() {
        return this.tag === '#TEXT';
    }

    get $first() {
        return this.nodes[0];
    }

    get $text() {
        if (this.isText) return this.text;
        return (this.$first&&this.$first.isText)?this.$first.text:undefined;
    }

    set $text(v) {
        if (this.isText) {
            this.text = v;
        } else {
            if (this.$text) {
                this.$first.$text = v;
            } else {
                this.text = v;
            }
        }
    }

    remove() {
        if (this.parent) {
            this.parent.nodes.splice(this.parent.nodes.indexOf(this),1);
            this.parent = undefined;
        }
    }
    //
    // child(vnode) {
    //     this.nodes.push(vnode);
    //     return this;
    // }

    static create(type, attributes, ...children) {
        if (children[0] instanceof Array) {
            children = children[0]
        }
        children = map(children,(ch)=>isStr(ch)?Vnode_.createText(ch):ch);
        let vn = new Vnode_(type);
        vn.attrs = attributes;
        vn.nodes = children;
        return vn;
    }

    static createText(text) {
        let vn = new Vnode_();
        vn.text = text;
        return vn;
    }

    static toElement(vn) {
        if (vn.tag === "#TEXT") {
            console.log("TEEXT",vn);
            return document.createTextNode(vn.text);
        }

        let e = document.createElement(vn.tag);
        vn.id && (e.id = vn.id);
        vn.attrs && forEach(vn.attrs,function (a, k, atr) {
            if (k === "style" && !isStr(a)) {
                let ns = "";
                forEach(a,(v, k) => {
                    ns += `${kebab(k)}: ${v};`;
                });
                e.setAttribute(k, ns);
            } else if (k === "class" && isArr(a)) {
                e.setAttribute(k, a.join(' '));
            } else if (k === "className") {
                e.className = a;
            } else {
                e.setAttribute(k, a);
            }
        });
        vn.props && forEach(vn.props,function (p, i, prp) {
            e[p] = prp[p];
        });
        forEach(vn.nodes,function (n) {
            append(e, Vnode_.toElement(n));
        });
        return e
    }

    static createFromElement(element, propertyNames, parentVNode) {
        element = $$(element)[0];
        let vnd = new Vnode_();
        if (element === undefined) return vnd;
        if (isVal(element.id) && element.id.trim() !== "") {
            vnd.id = element.id;
        }
        Object.defineProperty(vnd, 'parent', {value: vnd})
        if (isVal(element.tagName)) {
            vnd.tag = element.nodeName
        }
        if (element.nodeType === 3) {
            vnd.text = element.nodeValue;
            if (vnd.text.trim() === "") vnd.tag = null;
            return vnd;
        }
        if (element.tagName && element.attributes.length > 1 || element.attributes.length > 0) {
            vnd.attrs = {};
            let atrs = vnd.attrs;
            forEach(element.attributes, function (kv) {
                if (kv.name === "id") return vnd;
                atrs[kv.name] = kv.value;
            });
        }
        if (vnd.attrs && vnd.attrs["class"])
            vnd.cls = cls(element).items;

        // vnd.relQuery = X.queryOf(element, element.parentElement);
        let nds = vnd.nodes;
        forEach(element.childNodes, function (nd) {
            if (nd.nodeType === 8) return;
            let cvnd = Vnode_.createFromElement(nd, propertyNames, vnd);
            if (isNull(cvnd.tag)) return;
            nds.push(cvnd);
        });
        if (vnd.nodes[0] && vnd.nodes[0].tag === "#TEXT") {
            vnd.text = vnd.nodes[0].text
        }
        return vnd;
    }
}

module.exports = {VNode: Vnode_}