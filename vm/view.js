import {concat, deepClone} from "../core/collections";
import {debounce, throttle} from "../core/functions";
import {isObj} from "../core/types"
import {prepareChildren, randomId, sameProps} from "./util";
import NODETYPE from "./nodetype"
import {updateView} from "./patch";

/**
 * @property {Object} state
 * @property {Boolean} $isDirty
 * @property {Boolean} $isFrag
 * @property {Function} [onCreate]
 * @property {Function} [onUpdate]
 * @property {Function} [onDestroy]
 * @property {Function} [onMount]
 */
export class View {
    constructor(opt = {}, construct = opt) {
        this.$type = NODETYPE.VIEW
        this.$name = this.constructor.name
        this.$isView = true
        this.$node = undefined
        this.$isDirty = true
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
                        updateView(this)
                    })
                } else if (window.webkitRequestAnimationFrame) {
                    webkitRequestAnimationFrame(()=>{
                        updateView(this)
                    })
                } else updateView(this)
            }, 20),
            enumerable: false,
            configurable: false,
            writable: false
        })
    }

    render() {
        return ""
    }

    static create(name, opt) {
        let c = new View(opt)
        if (!opt.render) console.warn("render method is not defined")
        c.$name = name
        return c
    }

    createInstance(props, children) {
        const construct = this.$constructor
        const name = this.$name
        let inst = new View(construct, construct)
        inst.$name = name
        inst.$instanceId = randomId()
        inst.$isDirty = true
        return inst.updateInstance(props, children)
    }

    updateInstance(props, children) {
        if (!this.props) this.props = {}
        if (props) {
            concat(this.props, props, true)
        }
        if (children) children = prepareChildren(children)
        this.$children = children
        this.$instanceId = randomId()
        this.$isDirty = true
        return this
    }

    shouldUpdate (props={}) {
        // return this.$isDirty || JSON.stringify(this.props) !== JSON.stringify(props)
        return this.$isDirty || !sameProps(this.props, props)
    }

    setState(fn) {
        let state = fn.call(this, this.state)
        if (isObj(state)) {
            this.state = state
        }
        this.$update()
    }

    $remove() {
        if (this.onDestroy) this.onDestroy()
        if (!this.$isFrag) {
            this.$node.target.remove()
        }
        for (const ch of this.$node.nodes) {
            ch.$remove();
        }
    }

    $firstElement() {
        if (this.$node)
            return this.$node.$firstElement()
    }

    $lastElement() {
        if (this.$node)
            return this.$node.$lastElement()
    }
}