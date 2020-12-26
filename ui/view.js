require("../core/scope")
const TYPE = require("./type");
const {updateView} = require("./patch");
const {debounce} = require("../core/functions");
const {error} = require("../core/logging");
const {randomId, normalize, sameProps} = require("./utils");
const {createNode} = require("./vnode");
const {warn} = require("../core/logging");
const {deepClone} = require("../core/collections");
const {createText} = require("./vnode");

/**
 * @param {Object} args.state
 * @param {String} [args.name]
 * @param {Function} args.render
 * @param {Function} args.beforeUpdate
 * @param {Function} args.Updated
 * @param {Function} args.beforeMount
 * @param {Function} args.Mounted
 * @param {Function} args.beforeCreate
 * @param {Function} args.Created
 * @constructor
 */
function View(args = {}) {
    this.$t = TYPE.VIEW;
    args.name = args.name || 'View' + '::' + randomId();
    this.$name = args.name;
    this.$proto = Object.freeze(args);
    let props = Object.getOwnPropertyNames(args);
    for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        if (args[prop] instanceof Function) {
            this[prop] = args[prop].bind(this);
        } else {
            this[prop] = deepClone(args[prop]);
        }
    }

    // this.$instanceId = Symbol('view')
    // this.$instanceId = randomId();
    this.props = this.props || {};
    this.state = this.state || {};
    // this.$children = [];
    if (!this.render) {
        warn("View has no render!");
        this.render = () => "";
    }

    Object.defineProperty(this, '$elements', {
        get() {
            return this.$nodes.flatMap((n) => {
                if (n === undefined || n === null) return [];
                if (n.$isView) return n.$elements;
                return n.element
            });
        }
    });
}

Object.defineProperty(View.prototype, '$parent', {
    value: undefined,
    configurable: false,
    writable: true,
    enumerable: false
})
View.prototype.$isView = true

View.prototype.$clone = function () {
    return new View({...this.$proto});
}

View.prototype.$updateWith = function (props, children) {
    if (props.key) {
        this.$key = props.key;
        // delete props.key
    }
    this.props = {...this.props, ...props};
    this.$children = normalize(children, {createText})
    return this
}

View.prototype.$renderNodes = function () {
    return normalize(this.render({props: this.props, state: this.state}),
        {createText, parent: this, empty: [createNode('slot', {style: 'display: none'})]})
}

View.prototype.$renderAndSetNodes = function () {
    if (this.beforeCreate)
        try {
            this.beforeCreate();
        } catch (e) {
            setTimeout(error('(' + this.$name + ').beforeCreate()', e))
        }
    this.$nodes = this.$renderNodes();
    if (this.Created)
        try {
            this.Created();
        } catch (e) {
            setTimeout(error('(' + this.$name + ').Created()', e))
        }
    return this
}

View.prototype.$destroy = function (getAnchor) {
    if (this.beforeDestroy) {
        try {
            this.beforeDestroy();
        } catch (e) {
            setTimeout(error('(' + this.$name + ').beforeDestroy()', e));
        }
    }
    // first real dom element
    let firstEl = undefined;
    for (let i = 0; i < this.$nodes.length; i++) {
        let n = this.$nodes[i];
        if (n.element) {
            if (!firstEl) firstEl = n.element
            else n.element.remove();
        } else {
            firstEl = firstEl || n.$destroy();
        }
    }
    if (getAnchor) return firstEl
    else (firstEl && firstEl.remove())
}

View.prototype.$clean = function () {
    this.$nodes = undefined;
    this.state = undefined;
    this.props = undefined;
}
//
View.prototype.$update = debounce(function () {
    updateView(this);
}, 20);
//
// View.prototype.$update = function () {
//     updateView(this);
// };

View.prototype.setState = function (fn) {
    let state = this.state;
    fn.call(this, state);
    // this.$isDirty = !sameProps(this.state, state);
    this.$isDirty = true;
    // console.log('setState', this)
    this.$update();
}

// View.prototype.$update = debounce(function () {
//     this.$isDirty = true;
//     // console.trace('$update', this.$name, this.props)
//     dispatchTask(() => patchView(this, this.props, this.$children), this.$instanceId)
// }, 5)


function isViewClass(cls) {
    return Object.prototype.isPrototypeOf.call(View, cls)
}

function getViewInstance(view, newArgs) {
    if (isViewClass(view)) {
        return new view(newArgs)
    }
    if (view instanceof View) {
        return view;
    }
    if (view === View) {
        return new View(newArgs)
    }
    throw TypeError("Cannot get view instance of " + view)
}

function renderView(view, props, children) {
    // // if (!view.props) view.props = {};
    // if (props) {
    //     concat(view.props, props, true);
    // }

    // if (children) {
    children = normalize(children || [], {createText});
    view.$children = children;
    // }
    view.$updateWith(props, children)
    view.$renderAndSetNodes();

    return view;
}

/**
 * @typedef View
 * @class
 * @member {Function} beforeCreate
 * @member {Function} Created
 * @member {Function} beforeMount
 * @member {Function} Mounted
 * @member {Function} beforeUpdate
 * @member {Function} Updated
 * @member {Function} beforeDestroy
 */
module.exports = {
    View, isViewClass, getViewInstance, createView: function (args) {
        return new View(args)
    }, renderView
}