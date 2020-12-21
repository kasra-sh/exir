const View = require("./view_base");
const NodeType = require("./nodetype");

// /**
//  * @class
//  * @property $type
//  * @property $tag
//  * @property $frag
//  * @property $nodes
//  * @property attrs
//  * @property events
//  * @property $element
//  * @property $isNode
//  * @property $isText
//  */
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

VNode.createText = function (text) {
    return new VNode('#text', text);
}

VNode.createTag = function (tag, props, nodes) {
    return new VNode(tag, props, nodes);
}

module.exports = VNode;