const {normalize} = require("./utils");
const {renderView} = require("./view");
const {createNode, createText} = require("./vnode");


function h(type, prop, ...children) {
    if (type === null) {
        return children || [];
    }
    if (prop === null || prop === undefined) {
        prop = {};
    }
    if (type.$isView) {
        return renderView(type.$clone(), prop, children);
    }

    return createNode(type, prop, normalize(children, {createText}));
}

function t(text) {
    return createText(text)
}

module.exports = {h, t}