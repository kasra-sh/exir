const {View, createView} = require("./view");
const {h} = require("./h");
const {render} = require("./render");

/**
 * @type {function(*): View}
 * @alias createView
 */
const createComponent = createView;
/**
 * @type {function(type, props, ...children): View|VNode}
 */
const jsx = h;

/**
 * @param {{attachTo: function(type)}} plugin
 */
const use = function (plugin) {
    plugin.attachTo(View);
}

module.exports = {Exir:{
    View, createComponent, jsx, mount: render, use
}}