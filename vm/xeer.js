const {$$} = require("../dom/query");
const {filter, forEach, map} = require("../core/collections");
const {isNull, isStr, isArr, isVal, isFun} = require("../core/types");
const {kebab} = require("../core/cases");
// const {cls} = require("../dom/classes");
const {append} = require("../dom/append");

/**
 *
 * @param {VNode} vn
 * @returns {Text|*}
 */
function createDom(vn) {
    if (vn.tag === "#text") {
        let text = document.createTextNode(vn.text);;
        vn.element = text;
        text.__XEER__ = vn;
        return text;
    }

    let element = document.createElement(vn.tag);
    vn.id && (element.id = vn.id);
    vn.attr && forEach(vn.attr,function (a, k, atr) {
        if (k === "style" && !isStr(a)) {
            let ns = "";
            forEach(a,(v, k) => {
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
    vn.props && forEach(vn.props,function (p, i, prp) {
        element[p] = prp[p];
    });
    forEach(vn.nodes,function (n) {
        append(element, createDom(n));
    });
    vn.element = element;
    element.__XEER__ = vn;
    return element
}

function render(c, ctx) {
    if (isFun(c)) {
        return createDom(c(ctx));
    }
    return createDom(c.view(ctx));
}

function mount(root, component) {
    root = $$(root)[0];
    if (root.__X_MOUNTED__) {
        console.log("must patch", component);
        return;
    }
    root.__X_MOUNTED__ = true;
    console.log(root);
    let rendered = render(component, {});
    console.log("Rendered",rendered);
    console.log("Component",component);
    root.append(rendered);
}

module.exports = {
    createDom,
    mount
}