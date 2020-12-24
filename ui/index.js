const {View, createView} = require("./view");
const h = require("./h");
const {render} = require("./render");

/**
 * @type {View.create}
 */
const createComponent = createView;
/**
 * @type {function(*, *=): [VNode]}
 */
const jsx = h;

/**
 *
 * @type {{createComponent: View.create, View: View, mount: function(*=, *=): void, jsx: (function(*, *=): VNode[])}}
 */
module.exports = {
    View, createComponent, jsx, mount: render
}