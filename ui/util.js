// import {error, forEach, isArr, isPrim, isStr, isVal} from "../core";
// import JSS from "./jss";
// import View from "./view";
// import VNode from "./vnode";
const {isArr, isStr, isVal} = require("../core/types");
const {forEach} = require("../core/collections");
const JSS = require("./jss");


function isEventPropKey(key) {
    return /on[A-Z]+/.test(key)
}

function normalizeEventName(eventName) {
    return eventName.slice(2).toLowerCase()
}

function randomId() {
    return (Date.now().toString(24).slice(2)+ Math.random().toString(24).slice(6))
}

function randomHexColor() {
    return '#'+(Math.random().toString(16)).slice(2, 8)
}

function compileProps(props) {
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

function compileStyles(styles, joinWith) {
    if (!isVal(styles)) return ''
    else if (isStr(styles)) return styles
    else if (isArr(styles)) return styles.join(joinWith)
    return JSS.generateCss(styles, joinWith)
}

function sameProps(currentProps={}, newProps={}) {
    const curKeys = Object.keys(currentProps)
    const newKeys = Object.keys(newProps)
    if (curKeys.length !== newKeys.length) return false
    for (let curKey of curKeys) {
        if (newProps[curKey] !== currentProps[curKey]) return false
    }
    return true
}

module.exports = {
    isEventPropKey,
    normalizeEventName,
    randomId,
    randomHexColor,
    compileProps,
    compileStyles,
    sameProps
}