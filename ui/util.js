import {error, forEach, isArr, isPrim, isStr, isVal} from "../core";
import JSS from "./jss";
import View from "./view";
import VNode from "./vnode";

export function isEventPropKey(key) {
    return /on[A-Z]+/.test(key)
}

export function normalizeEventName(eventName) {
    return eventName.slice(2).toLowerCase()
}

export function randomId() {
    return (Date.now().toString(24).slice(2)+ Math.random().toString(24).slice(6))
}

export function randomHexColor() {
    return '#'+(Math.random().toString(16)).slice(2, 8)
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

export function normalizeNodes(nodes = [], parent, view, render = false) {
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
                let nn = normalizeNodes(node, parent, view, render)
                for (let j = 0; j < nn.length; j++) {
                    normalizedNodes.push(render ? nn[j].$render(parent, view) : nn[j]);
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
