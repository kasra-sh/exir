import {isVal, isNum, isStr, isPrim} from "../core/types";
import {deepClone, forEach} from "../core/collections";
import {isEventPropKey, normalizeEventName} from "./util";
import View from "./view";
import {error} from "../core";
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
        // error(,nodes)
        return type.$createInstance(props, nodes);
    }

    // View class
    if (type.$type === NodeType.VIEW) {
        // error('update')
        return new type().$updateInstance(props, nodes);
    }

    if (!type.$type && type instanceof Function) {
        console.log('func', type);
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
                console.log(e,curNode);
            }
        }
    }
    this.$raw = false;
    return this;
}

VNode.prototype.$resetNodes = function (nodes) {
    try {
        this.$nodes = VNode.normalizeNodes(nodes);
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

VNode.normalizeNodes = function (nodes = [], parent, view, render = false) {
    let normalizedNodes = [];
    // console.error(parent, nodes)
    if (!(nodes instanceof Array)) nodes = [nodes];
    try {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            // replace text
            if (!isVal(node)) node = ""+node;
            if (isPrim(node)) {
                let n = VNode.createText(node.toString());
                n.$parent = parent;
                normalizedNodes.push(n);
                continue;
            }
            if (node.$isView) {
                normalizedNodes.push(render ? node.$render(parent, node) : node);
                continue;
            }
            // skip fragments
            if (node.$frag) node = node.$nodes;
            // flatten array or non-view fragment
            if (node instanceof Array) {
                for (let j = 0; j < node.length; j++) {
                    let nj = node[j];
                    if (!isVal(nj)) nj = ""+nj;
                    if (isPrim(nj)) {
                        nj = VNode.createText(nj.toString());
                        nj.$parent = parent;
                    } else if (!nj.$isView && nj instanceof Function) {
                        nj = View.create(nj.name, {render: nj});
                    }
                    normalizedNodes.push(render ? nj.$render(parent, view) : nj);
                }
            } else {
                if (!node.$isView && (node instanceof Function)) {
                    node = View.create(node.name, {render: node});
                    node.$parent = parent;
                } else if (!node.$isNode){
                    node = VNode.createText("" + node);
                    node.$parent = parent;
                }
                normalizedNodes.push((render)? node.$render(parent, view) : node);
            }
        }
        return normalizedNodes;
    }catch (e) {
        if (process.env.NODE_ENV === 'development') {
            let n = VNode.createTag('div',
                {style: "color: red!important; border: 3px dashed orange!important"},
                e.toString()
            )
            n.$parent = parent;
            return [n];
        } else {
            error(e);
            return [];
        }
    }
}

VNode.prototype.$clone = function (parent, view) {
    let cl = VNode.createTag(this.$tag,
        {attrs: deepClone(this.attrs), events: this.events},
        this.$nodes.map((n) => n.$clone()));
    return cl.$render(parent, view);
}

// global.VNode = VNode
export default VNode