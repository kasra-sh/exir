import {VNode} from "./vnode";
import {all, forEach} from "../../core/collections";

import {hasField, isArr, isFun, isNum, isStr, isVal} from "../../core/types";

import JSS from "./jss";

export function randomId() {
    return (Date.now().toString(24).slice(2)+ Math.random().toString(24).slice(6))
}

export function isComponent(node) {
    return isFun(node.render)
}

export function isStatic(node) {
    if (!isComponent(node)) {
        return all(node.nodes, (n)=>isStatic(n))
    } else return false
}

export function isEventPropKey(key) {
    return /on[A-Z]+/.test(key)
}

export function normalizeEventName(eventName) {
    return eventName.slice(2).toLowerCase()
}

export function compileProps(props) {
    const cats = {
        events: {},
        attrs: {}
    }
    forEach(props, (v, k)=>{
        if (isEventPropKey(k))
            cats.events[normalizeEventName(k)] = v
        else
            cats.attrs[k] = v
    })
    return cats
}

export function compileStyles(styles, joinWith) {
    if (!isVal(styles)) return ''
    else if (isStr(styles)) return styles
    else if (isArr(styles)) return styles.join(joinWith)
    return JSS.generateCss(styles, joinWith)
}

export function sameClass(t1, t2) {
    let name1 = t1.constructor.name
    let name2 = t2.name
    if (hasField(t1, 'prototype')) {
        name1 = t1.prototype.constructor.name
    }
    if (hasField(t2, 'prototype')) {
        name2 = t2.prototype.constructor.name
    }
    console.log(name1, name2)
    return name1 === name2
}

export function instanceOf(inst, cls) {
    const instProto = Object.getPrototypeOf(inst)
    const classProto = cls.prototype
    // console.log(instProto, classProto)
    return instProto.constructor.name === classProto.constructor.name
}

export function isChildOf(child, parent) {
    const parentProto = parent.prototype || Object.getPrototypeOf(parent)
    const parentName = parentProto.constructor.name
    let childProto = child.prototype || Object.getPrototypeOf(child)
    while (childProto) {
        if (childProto.name === parentName || childProto.constructor.name === parentName) return true
        childProto = Object.getPrototypeOf(childProto)
    }
    return false
}

export function renameFunc(fn, name) {
    return new Function("fn", `return function ${name}() {return fn.apply(this, arguments)}`)(fn)
}

export function copyPrototype(thing) {
    let props = Object.getOwnPropertyDescriptors(thing);
    let copied = Object.create({})
    Object.defineProperties(copied, props)
    console.log(copied)
    return copied
}

export function prepareChildren(children, after, rootView) {
    const flat = []
    const len = children.length
    for (let i=0; i<len; i++) {
        let child = children[i]
        if (child.$tag === 'FRAGMENT') child = child.nodes
        if (child.constructor.name === 'Array') {
            const clen = child.length
            for (let j=0; j<clen; j++) {
                let ch = child[j]
                if (isStr(ch) || isNum(ch)) {
                    ch = VNode.createText(ch.toString())
                }
                if (after) ch = after(ch)
                // ch.rootView = rootView
                flat.push(ch)
            }
        } else {
            if (isStr(child) || isNum(child)) {
                child = VNode.createText(child.toString())
            }
            if (after) child = after(child)
            // child.rootView = rootView
            flat.push(child)
        }
    }
    return flat
}

export function sameProps(currentProps={}, newProps={}) {
    const curKeys = Object.keys(currentProps)
    const newKeys = Object.keys(newProps)
    if (curKeys.length !== newKeys.length) return false
    for (let curKey of curKeys) {
        if (newProps[curKey] !== currentProps[curKey]) return false
    }
    return true
}

export function swapChildNodes(parent, nodes, newIndex, currentIndex) {
    parent.insertBefore(nodes[newIndex], nodes[currentIndex])
}

export function substituteTextNodes(children) {
    return children.map((ch) => {
        if (isStr(ch) || isNum(ch)) {
            return VNode.createText(ch.toString())
        } else return ch
    })
}

export default {
    randomId,
    compileProps,
    compileStyles,
    isComponent,
    isStatic,
    isEventPropKey,
    normalizeEventName,
    sameClass,
    isChildOf,
    instanceOf,
    renameFunc,
    copyPrototype,
    prepareChildren,
    swapChildNodes,
    substituteTextNodes,
    sameProps
}