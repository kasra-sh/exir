import {concat} from "../core/collections";
import util from "./util";
import {View} from "./view"
import NODETYPE from "./nodetype"
import {isNum, isStr} from "../core";

/**
 * @property {[VNode|View|String]|VNode|View|String} nodes
 * @property {View} [$root]
 * @property {Object} [attrs]
 * @property {HTMLElement|Element|Node} [target]
 */
export class VNode {
    constructor(tag, props, ...children) {
        this.$tag = tag;
        if (tag === '#text') {
            this.$type = NODETYPE.TEXT
            this.text = props
            this.isText = true
            return;
        }
        this.$isNode = true
        this.$type = NODETYPE.NODE

        if (tag === 'FRAGMENT') this.$isFrag = true

        if (props) {
            concat(this, util.compileProps(props))
        }

        if (children) {
            children = util.prepareChildren(children)
            this.nodes = children
        }
    }

    /**
     * Create View | VNode | #TEXT
     *
     * @param {View|VNode|String|Number} type
     * @param {Object|undefined} props
     * @param {View|VNode|String|Number} children
     * @returns {any|VNode}
     */
    static create(type, props = {}, ...children) {
        if (props === null) props = {};

        // flatten arrays and change str/num to VNode(#text)
        // children = util.prepareChildren(children)
        const nodes = []
        const len = children.length
        for (let i=0; i<len; i++) {
            let child = children[i]
            if (child.$tag === 'FRAGMENT') {
                // console.log('FRAG', type, child)
                child = child.nodes
            }
            // if (child.constructor.name === 'Array') {
            if (child instanceof Array) {
                const clen = child.length
                for (let j=0; j<clen; j++) {
                    let ch = child[j]
                    if (isStr(ch) || isNum(ch)) {
                        // ch = VNode.createText(ch.toString())
                        ch = new VNode('#text', ch.toString())
                    }
                    // if (after) ch = after(ch)
                    // ch.rootView = rootView
                    nodes.push(ch)
                }
            } else {
                if (isStr(child) || isNum(child)) {
                    // child = VNode.createText(child.toString())
                    child = new VNode('#text', child.toString())
                }
                // if (after) child = after(child)
                // child.rootView = rootView
                nodes.push(child)
                // child.$root = type
            }
        }
        children = nodes
        // children = util.prepareChildren(children)
        // View class instance
        if (type.$isView) {
            return type.createInstance(props, children)
        }

        // View class
        if (type.$type === NODETYPE.VIEW) {
            return new type().updateInstance(props, children)
        }

        // create VNode instance
        // return VNode.createTag(type, props, ...children);
        return new VNode(type, props, ...children)
    }

    static createText(str) {
        return new VNode('#text', str)
    }

    static createTag(type, props = {}, ...children) {
        return new VNode(type, props, ...children)
    }

    $remove() {
        if (!this.$isFrag && this.target) this.target.remove()
        if (this.nodes)
            for (let n of this.nodes) {
                n.$remove()
            }
    }

    $firstElement() {
        if (!this.$isFrag) return this.target
        if (this.nodes) {
            return this.nodes[0].$firstElement()
        }
    }

    $lastElement() {
        if (!this.$isFrag) return this.target
        if (this.nodes) {
            return this.nodes[this.nodes.length-1].$firstElement()
        }
    }
}