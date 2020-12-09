import VNode, {NodeType} from "./vnode";
import {concat, deepClone} from "../core/collections";
// import { error, info, showError, showInfo} from "../core/logging";
import { debounce} from "../core/functions";
import {normalizeNodes, randomId, sameProps} from "./util";
import {updateViewRoot} from "./patch";

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

    Object.defineProperty(this, '$update', {
        value: debounce(()=> {
            this.$isDirty = true;
            if (window.requestAnimationFrame) {
                requestAnimationFrame(()=>{
                    // if (!this.$isDirty) return;
                    updateViewRoot(this);
                })
            }else {
                updateViewRoot(this);
            }
            // console.log('done')
        }, 20),
        enumerable: false,
        configurable: false,
        writable: false
    })
}

View.prototype.setState = function (fn) {
    fn.call(this, this.state);
    this.$update();
}

View.create = function (name, opt) {
    let c = new View(opt);
    if (!opt.render) console.warn("render method is not defined");
    c.$name = name;
    return c;
}

View.prototype.$createInstance = function (props, children) {
    const construct = this.$constructor;
    const name = this.$name;
    let inst = new View(construct, construct);
    inst.$name = name;
    inst.$instanceId = randomId();
    Object.keys(inst).forEach((pname)=>{
        if (inst[pname] instanceof Function) {
            inst[pname] = inst[pname].bind(inst)
        }
    })
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
    return this;
}


View.prototype.$render = function (parent, view, initial = true) {
    if (initial && !this.$raw) return this;
    let rendered = this.render.call(this, this.props);
    // console.log(this.$name, this.state)
    // console.log(this.$name, rendered)
    if (rendered.length === 0) {
        rendered = [VNode.create('slot', {})];
    }
    View.$setNodes(this, rendered, true);
    // console.log(this.$name, this.$nodes)
    this.$parent = parent;
    this.$view = view;
    this.$raw = false;
    return this;
}

View.$setNodes = function (view, nodes, normalize) {
    if (nodes.length === 0) nodes = [VNode.createTag('slot')];
    if (normalize)
        view.$nodes = normalizeNodes(nodes, view, view,true);
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

View.$shoudUpdateDefault = function (viewInstance, newProps) {
    return viewInstance.$isDirty || !sameProps(viewInstance.props, newProps);
}

View.prototype.shouldUpdate = function (newProps) {
    return View.$shoudUpdateDefault(this, newProps);
}

View.prototype.$childByRef = function (ref) {
    if (this.$element) {
        return this.$element.querySelector(`[ref=${ref}]`).__node__;
    }
}

View.prototype.$removeDom = function (rootRemoved) {
    if (this.$single) {
        this.$element.remove();
        rootRemoved = true;
    }
    this.$nodes.forEach((n)=>n.$removeDom(rootRemoved));
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
    let cl = this.$createInstance(deepClone(this.props), this.$children.map((ch)=>ch.$clone()))
    return cl.$render(parent, view||cl)
}

View.prototype.$serialize = function () {
    return deepClone(this, {excludeKeys:['$parent', '$first', '$view', '$element', '$rootElement']})
}

View.prototype.$dispatchLifeCycle = function (name, ...args) {
    let lifecycleMethod = this[name]
    if (lifecycleMethod instanceof Function) {
        setTimeout(lifecycleMethod, 1, ...args)
    }
}


View.prototype.useState = function useState(state) {
    let items = (this.$state) || [];
    this.$state = items;
    let count = this.$stateCount || 0;
    items[count] = state
    let current = [
        function stateGetter() {
            return items[count]
        },
        function stateSetter(val) {
            items[count] = val
        }
    ]
    this.$stateCount = count + 1
    return current
}

View.prototype.initHook = function initHook(name, func) {
    if (!this[name]) this[name] = func
}

export default View