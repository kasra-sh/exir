const JSS = require("./jss");
const {setEvent} = require("../dom/event");
const {forEach} = require("../core/collections");
const {isPrim,isArr,isStr,isVal} = require("../core/types");

function randomId() {
    return (Date.now().toString(24).slice(2)+ Math.random().toString(24).slice(6))
}

function normalize(children, {createText, parent, empty=[], list}) {
    if (!(children instanceof Array)) {
        if (children === null || children === undefined)
            return empty
        else children = [children]
    }
    let norm = [];
    const len = children.length;
    for (let i = 0; i < len; i++) {
        let child = children[i];
        if (child === null || child === undefined || isPrim(child)) {
            if (typeof child === 'symbol') child = child.toString();
            child = createText("" + child);
            child.$parent = parent;
            norm.push(child);
            continue;
        }
        // fragment
        if (child.isNode && child.tag === null) {
            child = child.children || [];
        }
        if (child instanceof Array) {
            child = normalize(child, {createText, parent});
            for (let j = 0; j < child.length; j++) {
                child[j].$parent = parent;
                norm.push(child[j]);
            }
            // norm.push(list(child))
            continue;
        }
        child.$parent = parent;
        norm.push(child);
    }
    if (norm.length === 0) norm = empty;
    return norm
}


function isEventPropKey(key) {
    return /on[A-Z]+/.test(key)
}

function normalizeEventName(eventName) {
    return eventName.slice(2).toLowerCase()
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

function setElementProps(element, attrs, events, view) {
    if (attrs) {
        forEach(attrs, (val, key) => {
            if (key === 'style') {
                val = compileStyles(val, ' ')
            } else if (key === 'className') {
                key = 'class'
            }
            element.setAttribute(key, val)
        })
    }

    if (events) {
        forEach(events, (v, k) => {
            if (view) v = v.bind(view)
            setEvent(element, k, v)
        })
    }
}

function randomHexColor() {
    return '#'+(Math.random().toString(16)).slice(2, 8)
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

module.exports = {randomId, normalize, setElementProps, compileProps, compileStyles, sameProps, randomHexColor}