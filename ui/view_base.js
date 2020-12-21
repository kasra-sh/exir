const NodeType = require("./nodetype");
const {deepClone} = require("../core/collections");

/**
 * @class
 * @property {Number} $type
 * @property {String} $name
 * @property {[VNode|View]} $nodes
 * @property {Number} $count
 * @property {Boolean} $empty
 * @abstract {Function} render
 * @property {Object} state
 * @property {Object} props
 * @property {Function} setState
 * @property {Function} useState
 * @property {Function} useEffect
 * @property {Boolean} $isDirty
 * @property {Object} $constructor
 * @property {HTMLElement|Element|Node} $element
 * @property {Function} $createInstance
 * @property {Function} $updateInstance
 * @property {Function} $update
 * @property {Function} $ref
 * @property {Function} $clone
 * @property {Function} $remove
 * @property {Function} shouldUpdate
 * @property {Function} $renderDom
 * @property {Function} $removeDom
 */
function View(opt = {}, construct = opt) {
    this.$type = NodeType.VIEW;
    // derived class
    this.$name = this.constructor.name;
    this.$isView = true;
    this.$nodes = undefined;
    this.$isDirty = true;
    this.$raw = true;
    this.$constructor = construct;

    let cons = Object.getOwnPropertyNames(this.$constructor)
    for (let i = 0; i < cons.length; i++) {
        const prop = cons[i];
        if (this.$constructor[prop] instanceof Function) {
            this[prop] = this.$constructor[prop];
        } else {
            this[prop] = deepClone(this.$constructor[prop]);
        }
    }
}

View.create = function (name, opt) {
    let c = new View(opt);
    if (!opt.render) console.warn("render method is not defined");
    c.$name = name;
    return c;
}

View.$callRender = function (view) {
    view.$useStateIndex = 0
    return view.render.call(view, view.props);
}

module.exports = View
// export default View