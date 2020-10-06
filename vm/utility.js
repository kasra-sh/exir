const {warn} = require("../core/logging");
const {first, forEach} = require("../core/collections");

function detachChildren(root) {
    let children = Array.from(root.children);
    forEach(children, (c)=>{c.remove()});
    return children;
}

function replaceFirstChild(root, element) {
    // ideal case
    if (root.children.length === 0) {
        return root.append(element);
    }

    if (root.children.length>0) {
        warn('Root is not empty');
        let children = detachChildren(root);
        if (children[0].__X_VDOM__) {
            children[0] = element
        } else {
            children = children.reverse().push(element);
            children = children.reverse();
        }
        root.append(...children);
    }
}

function replaceChildren(root, element) {
    detachChildren(root);
    root.append(element);
}

module.exports = {
    detachChildren,
    replaceChildren,
    replaceFirstChild
}