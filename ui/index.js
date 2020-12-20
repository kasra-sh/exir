const View = require("./view_base"); require("./view")
const VNode = require("./vnode_base");require("./vnode");
const mount = require("./mount");

/**
 * @type {View.create}
 */
const createComponent = View.create
/**
 * @type {function(*, *=): [VNode]}
 */
const jsx = VNode.create

/**
 *
 * @type {{createComponent: View.create, View: View, mount: function(*=, *=): void, jsx: (function(*, *=): VNode[])}}
 */
module.exports = {
    View, createComponent, jsx, mount
}