import VNode, {NodeType} from "./vnode";
import {concat, debounce, deepClone, error, info, showError, showInfo} from "../core";
import {randomId, sameProps} from "./util";
import {updateViewRoot} from "./patch";

function View(opt = {}, construct = opt) {
    this.$type = NodeType.VIEW
    // derived class
    this.$name = this.constructor.name
    this.$isView = true
    this.$nodes = undefined
    this.$isDirty = true
    this.$raw = true
    this.$constructor = construct
    let cons = Object.getOwnPropertyNames(this.$constructor)
    for (let i = 0; i < cons.length; i++) {
        const prop = cons[i]
        if (this.$constructor[prop] instanceof Function) {
            this[prop] = this.$constructor[prop]
        } else {
            this[prop] = deepClone(this.$constructor[prop])
        }
    }

    Object.defineProperty(this, '$update', {
        value: debounce(()=> {
            this.$isDirty = true
            if (window.requestAnimationFrame) {
                requestAnimationFrame(()=>{
                    updateViewRoot(this)
                })
            }else {
                updateViewRoot(this)
            }
            // console.log('done')
        }, 20),
        enumerable: false,
        configurable: false,
        writable: false
    })
}


View.create = function (name, opt) {
    let c = new View(opt)
    if (!opt.render) console.warn("render method is not defined")
    c.$name = name
    return c
}


View.prototype.$createInstance = function (props, children) {
    const construct = this.$constructor
    const name = this.$name
    let inst = new View(construct, construct)
    inst.$name = name
    inst.$instanceId = randomId()
    inst.$isDirty = true
    return inst.$updateInstance(props, children)
}


View.prototype.$updateInstance = function (props, children, parent) {
    if (!this.props) this.props = {}
    if (props) {
        concat(this.props, props, true)
    }

    if (children) children = VNode.normalizeNodes(children, undefined, this, true)
    this.$children = children

    this.$instanceId = randomId()
    this.$isDirty = true

    return this
}


View.prototype.$render = function (parent, view, initial = true) {
    if (initial && !this.$raw) return this
    let rendered = this.render()
    if (rendered.length === 0) {
        rendered = [VNode.create('slot', {})]
    }
    View.$setNodes(this, rendered, true)
    // if (this.$empty) {
    //     View.$setNodes(this, [VNode.create('slot')], false)
    // }
    this.$parent = parent
    this.$view = view
    this.$raw = false
    return this
}

View.$setNodes = function (view, nodes, normalize) {
    if (nodes.length === 0) nodes = [VNode.createTag('slot')]
    if (normalize)
        view.$nodes = VNode.normalizeNodes(nodes, view, view,true)
    else
        view.$nodes = nodes
    view.$count = view.$nodes.length
    if (!(view.$empty = view.$count === 0)) {
        view.$first = view.$nodes[0]
    }
    if (view.$count === 1) {
        view.$single = true
    }
}

//
// View.$resetNodes = function (view, nodes) {
//     view.$nodes = VNode.normalizeNodes(nodes, view, view,true)
//     view.$count = view.$nodes.length
//     if ((view.$empty = view.$count) !== 0) {
//         view.$first = view.$nodes[0]
//     }
//     if (view.$count === 1) {
//         view.$single = true
//     }
//     return nodes
// }


View.prototype.shouldUpdate = function (newProps) {
    return this.$isDirty || !sameProps(this.props, newProps)
}

View.prototype.$removeDom = function () {
    if (this.$single) return this.$element.remove();
    this.$nodes.forEach((n)=>n.$removeDom())
}


View.prototype.$update = debounce(function () {
    this.$isDirty = true
    console.log('UPDATING', this)
}, 20)


View.prototype.$renderDom = function (targetElement) {
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

export default View