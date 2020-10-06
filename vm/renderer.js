const {Component} = require("./component");
const {VNode} = require("./vnode");
const {$$} = require("../dom/query");
const {filter, forEach, map} = require("../core/collections");
const {isNull, isStr, isArr, isVal, isFun, hasField} = require("../core/types");
const {kebab} = require("../core/cases");
// const {cls} = require("../dom/classes");
const {append} = require("../dom/append");

/**
 *
 * @param {VNode|{view:Function}|Function} vnode
 * @param {Object} ctx
 * @returns {Text|*}
 */
function createVDom(vnode, ctx = {}) {
    // console.log("NODE",vnode)
    if (Component.isPrototypeOf(vnode)) {
        let inst = Object.create(vnode.prototype);
        vnode = inst.view();
    } else if (hasField(vnode, 'view')) {
        // console.log("VIEW", vnode)
        vnode = vnode.view(ctx);
        // console.log("VIEW-AFTER", vnode)
    } else if (isFun(vnode)) {
        // console.log("FUN")
        vnode = vnode(ctx);
    } else if (isStr(vnode)) {
        // console.log("STR")
        vnode = VNode.createText(vnode);
    }
    if (!(vnode instanceof VNode)) {
        throw Error(`Illegal value "${vnode}", not supported in VirtualDOM tree`);
    }

    if (vnode.isRef === true) {
        // console.log("REF",vnode)
        vnode = createVDom(vnode.target, vnode.props);
    }
    vnode.nodes = map(vnode.nodes, function (child, i) {
        // console.log("child", i)
        return createVDom(child)
    });

    return vnode;
}

/**
 *
 * @param {VNode} vn
 * @param {Object} ctx
 * @returns {Text|*}
 */
function createDom(vn, ctx = {}) {
    if (vn.tag === "#text") {
        let text = document.createTextNode(vn.text);
        vn.element = text;
        text.__X_VDOM__ = vn;
        return text;
    }

    let element = document.createElement(vn.tag);
    vn.id && (element.id = vn.id);
    vn.attr && forEach(vn.attr, function (a, k, atr) {
        if (k === "style" && !isStr(a)) {
            let ns = "";
            forEach(a, (v, k) => {
                ns += `${kebab(k)}: ${v};`;
            });
            element.setAttribute(k, ns);
        } else if (k === "class" && isArr(a)) {
            element.setAttribute(k, a.join(' '));
        } else if (k === "className") {
            element.className = a;
        } else {
            element.setAttribute(k, a);
        }
    });

    forEach(vn.nodes, function (n) {
        append(element, createDom(n));
    });

    vn.element = element;
    element.__X_VDOM__ = vn;
    return element
}

function render(c, ctx) {
    let vdom = createVDom(c, ctx);
    console.log("VDOM", vdom);
    return createDom(vdom);
}

function mount(root, component, force = false) {
    root = $$(root)[0];
    if (root.__X_VDOM__ && !force) {
        console.log("must patch", component);
        return;
    }
    root.__X_VDOM__ = true;
    console.log(root);
    let rendered = render(component, {});
    console.log("Rendered", rendered);
    console.log("Component", component);
    root.append(rendered);
}

module.exports = {
    createDom,
    createVDom,
    render,
    mount
}