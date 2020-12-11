import {isArr, isStr, isVal} from "../core/types";
import {info, warn, error, trace} from "../core/logging";
import {forEach} from "../core/collections";
import {setEvent} from "../dom/event";
import JSS from "./jss";
import VNode from "./vnode";

function compileStyles(styles, joinWith) {
    if (!isVal(styles)) return ''
    else if (isStr(styles)) return styles
    else if (isArr(styles)) return styles.join(joinWith)
    return JSS.generateCss(styles, joinWith)
}

function setElementProps(element, node, view) {
    if (node.attrs) {
        forEach(node.attrs, (val, key) => {
            if (key === 'style') {
                val = compileStyles(val, ' ')
            } else if (key === 'className') {
                key = 'class'
            }
            element.setAttribute(key, val)
        })
    }

    if (node.events) {
        forEach(node.events, (v, k) => {
            if (view) v = v.bind(view)
            setEvent(element, k, v)
        })
    }
}


export function renderDomChildren(node, parentElement) {
    let nodes = []
    for (let i = 0; i < node.$count; i++) {
        const curNode = node.$nodes[i]
        if (curNode.$isText) {
            nodes.push(renderDomText(curNode))
        } else {
            let childDom = undefined
            if (curNode.$raw) curNode.$render(curNode, curNode.$view)

            if (curNode.$isView) {
                curNode.$dispatchLifeCycle('onCreate', curNode.props)
                childDom = renderDomView(curNode, node.$element || parentElement)
                curNode.$dispatchLifeCycle('onMount', curNode.props)
            } else if (curNode.$isNode) {
                childDom = renderDom(curNode)
            } else {
                error('Illegal node', curNode)
                throw Error(`Illegal child node`)
            }

            if (childDom instanceof Array) {
                childDom.forEach((c)=>nodes.push(c))
            } else {
                nodes.push(childDom)
            }
        }
    }
    return nodes
}


export function renderDomView(node, parentElement, isRoot=false) {
    if (node.$raw) {
        node.$render(node.$parent, node.$view)
    }
    // if (node.$empty) {
    //     View.$setNodes(node, [VNode.create('slot')], false)
    //     node.$element = renderDom(node.$first)
    //     node.$element.__view__ = node
    //     node.$element.__node__ = node.$first
    //     return [node.$element]
    // }
    let children = renderDomChildren(node, parentElement)

    let currentElement = (!node.$parent)?parentElement:undefined
    if (node.$single){
        currentElement = children[0]
    }

    if (currentElement && !node.$single) {
        // console.log('not single', children)
        children.forEach((c)=>currentElement.append(c));
        children = [currentElement];
        currentElement.__view__ = node;
    }
    // warn(node, currentElement,node.$parent&& node.$parent.$rootElement)
    node.$element = currentElement
    node.$rootElement = node.$rootElement || parentElement ||
        (node.$parent && node.$parent.$element) ||
        (node.$parent && node.$parent.$rootElement);

    if (!node.$rootElement) {
        info('no root',node);
    } else {
        if (node.$element === parentElement) {
            info('Parent is the same element');
        } else if (parentElement){
            children.forEach((c)=>parentElement.append(c));
        } else  {
            children.forEach((c)=>node.$rootElement.append(c));
            // console.log(node)
        }
        node.$rootElement.__view__ = node;
    }
    node.$isDirty = false
    return node.$element || children;
}


export function renderDomText(node) {
    let textNode = document.createTextNode(node.$text)
    node.$element = textNode
    textNode.__node__ = node
    return textNode
}


export function renderDom(node, parentElement, replaceParent) {
    if (!node) console.trace(node)
    let currentElement = undefined
    if (node.$isText) return renderDomText(node)
    if (node.$isNode || (node.$frag && parentElement)) {
        //#region Done
        let id = undefined
        // if (!node.$parent) {
        if (replaceParent) {
            id = parentElement.id
            currentElement = parentElement
        } else {
            currentElement = document.createElement(node.$tag)
        }

        setElementProps(currentElement, node, node.$view)
        if (id) currentElement.id = id
        currentElement.__node__ = node
        node.$element = currentElement
        //#endregion A
        let children = renderDomChildren(node, currentElement)
        try {
            children.forEach((c)=>{
                try {
                    currentElement.append(c)
                }catch (ee) {
                    console.error(c, ee)
                }
            })
        } catch (e) {
            console.error(node, e)
        }

        return currentElement
    }

    if (node instanceof Array) {
        node = VNode.create(null, undefined, node)
        node.$render()
    }
    if (node.$frag) {
        if (!parentElement) {
            warn('Rendering fragment without rootElement', node)
            return renderDomChildren(node)
        } else {
            let children = renderDomChildren(node, parentElement)
            children.forEach((ch)=>{
                parentElement.append(ch)
            })
            return parentElement
        }
    }
    node.$dispatchLifeCycle('onCreate', node.props)
    let rendered = renderDomView(node, parentElement)
    node.$dispatchLifeCycle('onMount', node.props)
    return rendered
}


export default renderDom