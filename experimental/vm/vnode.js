const I = require("../../core/iter");
const T = require("../../core/types");
const Case = require("../../core/cases");
const Dom = require("../../ui/dom")

/**
 * @property tag
 * @property id
 * @property cls
 * @property attrs
 * @property props
 * @property text
 * @property nodes
 */
class VNode {
    __x__ = {};
    tag;
    nodes = [];
    constructor(tag = '#TEXT') {
        this.tag = tag.toUpperCase();
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

    child(vnode) {
        this.nodes.push(vnode);
        return this;
    }

    static create(type, attrs, ...children) {
        if (children[0] instanceof Array) {
            children = children[0]
        }
        children = I.Map(children,(ch)=>T.isStr(ch)?VNode.createText(ch):ch);
        let vn = new VNode(type);
        vn.attrs = attrs;
        vn.nodes = children;
        return vn;
    }

    static createText(text) {
        let vn = new VNode();
        vn.text = text;
        return vn;
    }

    static toElement(vn) {
        if (vn.tag === "#TEXT") {
            return document.createTextNode(vn.text);
        }

        let e = document.createElement(vn.tag);
        vn.id && (e.id = vn.id);
        vn.attrs && I.ForEach(vn.attrs,function (a, k, atr) {
            if (k === "style" && !T.isStr(a)) {
                let ns = "";
                I.ForEach(a,(v, k) => {
                    ns += `${Case.toKebab(k)}: ${v};`;
                    // ns[k.toKebab()] = v;
                });
                e.setAttribute(k, ns);

            } else {
                e.setAttribute(k, a);
            }
        });
        vn.props && I.ForEach(vn.props,function (p, i, prp) {
            e[p] = prp[p];
        });
        I.ForEach(vn.nodes,function (n) {
            Dom.Append(e, VNode.toElement(n));
        });
        return e
    }

    static from(element, parentVNode) {
        let vnd = new VNode();
        if (element === undefined) return vnd;
        if (T.isVal(element.id) && element.id.trim() !== "") {
            vnd.id = element.id;
        }
        if (T.isVal(element.tagName)) {
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
            I.ForEach(element.attributes, function (kv) {
                if (kv.name === "id") return vnd;
                atrs[kv.name] = kv.value;
            });
        }
        if (vnd.attrs && vnd.attrs["class"])
            vnd.cls = element.cls().items();

        for (let k in element) {
            if (!element.hasOwnProperty(k)) continue;
            vnd.props || (vnd.props = {});
            vnd.props[k] = element[k]
        }

        // vnd.relQuery = X.queryOf(element, element.parentElement);
        let nds = vnd.nodes;
        I.ForEach(element.childNodes, function (nd) {
            if (nd.nodeType === 8) return;
            let cvnd = VNode.from(nd, vnd);
            if (T.isNull(cvnd.tag)) return;
            Object.defineProperty(cvnd, 'parent', {value: vnd})
            nds.push(cvnd);
        });
        if (vnd.nodes[0] && vnd.nodes[0].tag === "#TEXT") {
            vnd.text = vnd.nodes[0].text
        }
        return vnd;
    }
}

function ve(a1, ...a) {
    let vn = new VNode();
    vn.tag = "";
    a1 = a1.trim();
    let cs = I.contains(a1,"#");
    let cd = I.contains(a1,".");
    if (cd || cs) {
        let sp = a1.split('#');
        if (cs) {
            vn.tag = sp[0].toUpperCase();
            if (!cd) {
                vn.id = a1.split("#")[1];
            }
        }
        if (cd) {
            let ic = (sp.length>1?sp[1]:sp[0]).split(".");
            if (!cs) {
                vn.tag = ic[0].toUpperCase();
            } else {
                vn.id = ic[0];
            }
            vn.cls = ic.slice(1);
            // add classes to attributes
            // if (!vn.attrs) vn.attrs = {};
            // vn.attrs['class'] = '.'+vn.cls.join(' .');
        }
    } else {
        vn.tag = a1.toUpperCase();
    }
    if (vn.tag === "" || vn.tag === undefined)
        vn.tag = "DIV";
    if (a.length>0) {
        let atid = 0;
        if (!a[0].hasOwnProperty("__x__") && !T.isStr(a[0])) {
            vn.attrs = a[0];
            atid ++;
        }
        if (T.isArr(a[0])) {
            vn.nodes = a[0];
        } else if (!a[0].hasOwnProperty("__x__") && !T.isStr(a[0])) {
            vn.attrs = a[0];
            if (T.isArr(a[1])) {
                vn.nodes = a[1];
            } else
                vn.nodes = a.slice(1);
        } else {
            vn.nodes = a;
        }
        I.ForEach(vn.nodes,(n, i)=>{
            vn.nodes[i] = T.isStr(n)?vt(n): n;
            Object.defineProperty(vn.nodes[i], "parent", {value: vn});
        });
    }

    return vn;
}

function vt(text) {
    let vn = new VNode();
    vn.text = text;
    return vn;
}

module.exports = {VNode, ve, vt}