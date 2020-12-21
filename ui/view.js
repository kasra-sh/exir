const normalizeNodes = require("./normalizeNodes");
const {updateViewRoot} = require("./patch");
const View = require("./view_base")
const {sameProps} = require("./util");
const {isObj} = require("../core/types");
const {deepClone, concat} = require("../core/collections");
const {randomId} = require("./util");
const {debounce} = require("../core/functions");

View.prototype.$update = debounce(() => {
    this.$isDirty = true;
    if (window.requestAnimationFrame) {
        requestAnimationFrame(() => {
            // if (!this.$isDirty) return;
            updateViewRoot(this);
        })
    } else {
        updateViewRoot(this);
    }
    // console.log('done')
}, 20)


View.prototype.$createInstance = function (props, children) {
    const construct = this.$constructor;
    const name = this.$name;
    let inst = new View(construct, construct);
    inst.$name = name;
    inst.$instanceId = randomId();
    Object.keys(inst).forEach((pname) => {
        if (inst[pname] instanceof Function) {
            inst[pname] = inst[pname].bind(inst)
        }
    })
    inst.$useStateCount = 0
    inst.$useStates = []
    return inst.$updateInstance(props, children);
}

View.prototype.$updateInstance = function (props, children, parent) {
    if (!this.props) this.props = {};
    if (props) {
        concat(this.props, props, true);
    }

    if (children) children = normalizeNodes(children, parent, this, false);
    this.$children = children;

    this.$instanceId = randomId();
    // this.$isDirty = false;
    // console.warn("$update "+this.$instanceId+" "+name, this.state)

    this.$update = debounce(() => {
        this.$isDirty = true;
        if (window.requestAnimationFrame) {
            requestAnimationFrame(() => {
                // if (!this.$isDirty) return;
                updateViewRoot(this);
            })
        } else {
            updateViewRoot(this);
        }
        // console.log('done')
    }, 20)
    return this;
}

View.prototype.$render = function (parent, view, initial = true) {
    if (initial && !this.$raw) return this;
    let rendered = View.$callRender(this);
    // if (rendered.length === 0) {
    //     rendered = [VNode.create('slot', {})];
    // }
    View.$setNodes(this, rendered, true);
    // console.log(this.$name, this.$nodes)
    this.$parent = parent;
    this.$view = view;
    this.$raw = false;
    return this;
}

View.$setNodes = function (view, nodes, normalize) {
    // if (nodes.length === 0) nodes = [VNode.createTag('slot')];
    if (normalize)
        view.$nodes = normalizeNodes(nodes, view, view, true);
    else
        view.$nodes = nodes;
    view.$count = view.$nodes.length;
    if (!(view.$empty = view.$count === 0)) {
        view.$first = view.$nodes[0];
    }
    if (view.$count === 1) {
        view.$single = true;
    }
}

View.$shouldUpdateDefault = function (viewInstance, newProps) {
    return viewInstance.$isDirty || !sameProps(viewInstance.props, newProps);
}

View.prototype.shouldUpdate = function (newProps) {
    return View.$shouldUpdateDefault(this, newProps);
}

View.prototype.$ref = function (ref) {
    if (!this.$refs) {
        this.$refs = {}
    }
    let refChild = this.$refs[ref]
    if (this.props && this.props.ref === ref) return this
    if (this.$nodes) {
        for (let index = 0; (index < this.$nodes.length) && (refChild === undefined); index++) {
            refChild = this.$nodes[index].$ref(ref)
        }
    }
    this.$refs[ref] = refChild
    return refChild
}

View.prototype.$removeDom = function (rootRemoved) {
    if (this.$single) {
        this.$element.remove();
        rootRemoved = true;
    }
    this.$nodes.forEach((n) => n.$removeDom(rootRemoved));
    this.$dispatchLifeCycle('onDestroy');
}

View.prototype.$renderDom = function (targetElement, parent) {
    this.$parent = parent
    this.$rootElement = targetElement
    for (let i = 0; i < this.$count; i++) {
        targetElement.append(this.$nodes[i].$renderDom())
    }
}

View.prototype.$clone = function (parent, view) {
    let cl = this.$createInstance(deepClone(this.props), this.$children.map((ch) => ch.$clone()))
    return cl.$render(parent, view || cl)
}

View.prototype.$serialize = function () {
    return deepClone(this, {excludeKeys: ['$parent', '$first', '$view', '$element', '$rootElement']})
}

View.prototype.$dispatchLifeCycle = function (name, ...args) {
    let lifecycleMethod = this[name]
    if (lifecycleMethod instanceof Function) {
        setTimeout(lifecycleMethod, 1, ...args)
    }
}

View.prototype.setState = function (setter) {
    if (setter instanceof Function)
        setter = setter.call(this, this.state);
    if (isObj(setter)) {
        concat(this.state, setter, true)
    }
    this.$update();
}


View.prototype.useState = function useState(initial) {
    let index = this.$useStateIndex;
    if (index === this.$useStateCount) {
        this.$useStates.push(initial)
        this.$useStateCount += 1
    }
    this.$useStateIndex += 1
    return [this.$useStates[index], (val) => {
        this.$useStates[index] = val;
        this.$isDirty = true;
        this.$update()
    }]
}

View.prototype.useEffect = function useEffect(func) {
    this.onUpdate = func
}

/**
 * @constructor
 * @extends View
 */
module.exports = View;