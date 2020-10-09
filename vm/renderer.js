import {Component} from "./component";
import {VNode} from "./vnode";
import {forEach, map} from "../core/collections";
import {hasField, isArr, isFun, isStr} from "../core/types";
import {kebab} from "../core/cases";
import {append} from "../dom/append";


/**
 *
 * @param {VNode|{view:Function}|Function} node
 * @param {Object} ctx
 * @returns {Text|*}
 */
function createVDom(node, ctx = {}) {
    // console.log("PRENODE", node)
    if (Component.isPrototypeOf(node)) { // is component
        // console.log("COMP", node)
        let inst = Object.create(node.prototype);
        node = inst.view(ctx);
    } else if (hasField(node, 'view')) { // is object
        // console.log("VIEW", node)
        node = node.view(ctx);
        // console.log("VIEW-AFTER", node)
    } else if (isFun(node)) { // is function
        // console.log("FUN")
        node = node(ctx);
    } else if (isStr(node)) { // is text
        // console.log("STR")
        node = VNode.createText(node);
    }
    // console.log("NODE", node)

    if (node.isRef === true) {
        node = createVDom(node.target, node.props);
    }
    // console.log("NODEREF", node);


    // console.log("ARR", node)
    // if (node instanceof Array) return node;

    if (!(node instanceof VNode)) {
        console.log("ILL", node)
        throw Error(`Illegal value "${node}", not supported in VirtualDOM tree`);
    }
    // if (node.tag === 'FRAGMENT') {
    //     console.log("FRAG")
    //     return map(node.nodes, (ch)=>createDom(ch))
    // }
    // let frags =
    if (node.nodes)
        node.nodes = map(node.nodes, function (child, i) {
            // console.log("CHIIILD", child)
            return createVDom(child)
        });

    return node;
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
    // console.log("VDOM", vdom);
    return createDom(vdom);
}

module.exports = {
    createDom,
    createVDom,
    render
}