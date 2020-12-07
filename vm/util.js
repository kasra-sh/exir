import {forEach, isArr, isStr, isVal} from "../core";
import JSS from "./jss";

export function isEventPropKey(key) {
    return /on[A-Z]+/.test(key)
}

export function normalizeEventName(eventName) {
    return eventName.slice(2).toLowerCase()
}

export function randomId() {
    return (Date.now().toString(24).slice(2)+ Math.random().toString(24).slice(6))
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

export function sameProps(currentProps={}, newProps={}) {
    const curKeys = Object.keys(currentProps)
    const newKeys = Object.keys(newProps)
    if (curKeys.length !== newKeys.length) return false
    for (let curKey of curKeys) {
        if (newProps[curKey] !== currentProps[curKey]) return false
    }
    return true
}