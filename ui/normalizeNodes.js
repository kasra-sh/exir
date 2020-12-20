const {isPrim, isVal} = require("../core/types");
const {error} = require("../core/logging");
const View = require("./view_base");
const VNode = require("./vnode_base");

module.exports = function normalizeNodes(nodes = [], parent, view, render = false) {
    let normalizedNodes = [];
    // console.error(parent, nodes)
    if (!(nodes instanceof Array)) nodes = [nodes];
    try {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            // replace text
            if (!isVal(node)) node = "" + node;
            if (isPrim(node)) {
                let n = VNode.createText(node.toString());
                n.$parent = parent;
                normalizedNodes.push(n);
                continue;
            }
            if (node.$isView) {
                normalizedNodes.push(render ? node.$render(parent, node) : node);
                continue;
            }
            // skip fragments
            if (node.$frag) node = node.$nodes;
            // flatten array or non-view fragment
            if (node instanceof Array) {
                let nn = normalizeNodes(node, parent, view, render)
                for (let j = 0; j < nn.length; j++) {
                    normalizedNodes.push(render ? nn[j].$render(parent, view) : nn[j]);
                }
            } else {
                if (!node.$isView && (node instanceof Function)) {
                    node = View.create(node.name, {render: node});
                    node.$parent = parent;
                } else if (!node.$isNode) {
                    node = VNode.createText("" + node);
                    node.$parent = parent;
                }
                normalizedNodes.push((render) ? node.$render(parent, view) : node);
            }
        }
        return normalizedNodes;
    } catch (e) {
        if (process.env.NODE_ENV === 'development') {
            let n = VNode.createTag('div',
                {style: "color: red!important; border: 3px dashed orange!important"},
                e.toString()
            )
            n.$parent = parent;
            return [n];
        } else {
            error(e);
            return [];
        }
    }
}