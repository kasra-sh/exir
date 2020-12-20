const {deepClone, forEach} = require("../core/collections");
const {isEventPropKey, normalizeEventName} = require("./util");
const normalizeNodes = require("./normalizeNodes");
const VNode = require("./vnode_base");

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

/**
 * @type {View}
 */
module.exports = VNode