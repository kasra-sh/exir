import {deepClone, forEach} from "../core/collections";
import {isEventPropKey, normalizeEventName, normalizeNodes} from "./util";
import View from "./view";
import {concat, error} from "../core";
// import View from "./view";

export const NodeType = {
    VNODE: 0,
    VIEW: 1,
    TEXT: 2
}

function VNode(tag, props = {}, nodes) {
    this.$type = NodeType.VNODE;
    this.$tag = tag;
    if (tag === null) {
        this.$frag = true;
    } else {
        if (tag === '#text') {
            this.$isText = true;
            this.$text = props;
            return;
        }
        this.$isNode = true;
        let compiled = VNode.compileProps(props);
        this.events = compiled.events;
        this.attrs = compiled.attrs;
        this.$element = undefined;
    }
    this.$raw = true;
    // this.$nodes = nodes
    this.$resetNodes(nodes);
}

VNode.create = function (type, props = {}, ...nodes) {
    if (props === null) props = {};

    if (type === null) return new VNode(type, props, nodes);

    // View class instance
    if (type.$isView) {
        return type.$createInstance(props, nodes);
    }

    // View class
    if (type.prototype && type.prototype instanceof View) {
        return new type().$updateInstance(props, nodes);
    }

    // Function component
    if (!type.$type && type instanceof Function) {
        return View.create(type.name, {render: type}).$createInstance(props, nodes);
    }

    // create VNode instance
    return VNode.createTag(type, props, nodes);
}

VNode.compileProps = function (props) {
    const cats = {
        events: {},
        attrs: {}
    };
    forEach(props, (v, k) => {
        if (isEventPropKey(k))
            cats.events[normalizeEventName(k)] = v;
        else
            cats.attrs[k] = v;
    })
    return cats;
}

VNode.createText = function (text) {
    return new VNode('#text', text);
}

VNode.createTag = function (tag, props, nodes) {
    return new VNode(tag, props, nodes);
}

VNode.prototype.$render = function (parent, view) {
    this.$parent = parent;
    this.$view = view;
    for (let i = 0; i < this.$count; i++) {
        let curNode = this.$nodes[i];
        if (curNode.$isText) {
            curNode.$parent = this;
        } else {
            try {
                curNode = curNode.$render(this, view);
            } catch (e) {
                console.error(e,curNode);
            }
        }
    }
    this.$raw = false;
    // this.$resetNodes(this.$nodes)
    return this;
}

VNode.prototype.$resetNodes = function (nodes) {
    try {
        this.$nodes = normalizeNodes(nodes, this, this.$view, false);
    } catch (e) {
        console.log(e, this.$nodes);
    }
    this.$count = this.$nodes.length;
    if (!(this.$empty = (this.$count === 0))) {
        this.$first = this.$nodes[0];
    } else if (this.$count === 1) {
        this.$single = true;
    }
}

VNode.prototype.$removeDom = function (rootRemoved) {
    // try {
        if (!rootRemoved) this.$element.remove();
        if (!this.$isText)
            this.$nodes.forEach((ch)=>ch.$removeDom(rootRemoved))
    // } catch (e) {}
}

VNode.prototype.$clone = function (parent, view) {
    let cl = VNode.createTag(this.$tag,
        {attrs: deepClone(this.attrs), events: this.events},
        this.$nodes.map((n) => n.$clone(this, view)));
    return cl.$render(parent, view);
}


VNode.prototype.$ref = function (ref) {
    if (!this.$refs) {
        this.$refs = {}
    }
    let refChild = this.$refs[ref]
    if (this.attrs && this.attrs.ref === ref) return this
    if (this.$nodes) {
        for (let index = 0; (index < this.$nodes.length) && (refChild === undefined); index++) {
            refChild = this.$nodes[index].$ref(ref)
        }
    }
    return refChild
}

// global.VNode = VNode
export default VNode