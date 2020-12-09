import {updateAttributes} from "./update-attrs";
import renderDom, {renderDomView} from "./render";
// import {sameProps} from "./util";
import View from "./view";
import {error, info, showError, showTrace, trace, warn} from "../core/logging";
// import VNode from "./vnode";
import {normalizeNodes} from "./util";

export function updateViewRoot(view) {
    let newNodes = normalizeNodes(view.render.call(view, view.props), view, view, true)
    // console.log(newNodes)
    // console.log(newNodes, view.$nodes)
    // return
    patchNodes(view, newNodes, view.$rootElement)
    View.$setNodes(view, newNodes, false)
    view.$isDirty = false
    view.$dispatchLifeCycle('onUpdate', view.props)
}

export function isViewDirty(view, props) {
    // return true
    if (view.$isView) {
        return view.shouldUpdate(props)
    } else return true
}


function digElement(currentNode) {
    let element = undefined
    if (currentNode.$element) {
        // info('Dug ', currentNode.$element, currentNode)
        return currentNode.$element
    } else {
        let nodes = currentNode.$nodes
        for (let i = 0; i < nodes.length; i++) {
            if (element) {
                nodes[i].$removeDom()
            } else {
                element = digElement(nodes[i])
                if (element) nodes[i].$element = undefined
            }
        }
    }
    // console.log('Digged ', element, currentNode)
    return element
}

export function patchNodes(current, newNodes, rootElement) {
    // info('PATCH NODES OF', current)
    // info('ROOT ELEMENT IS ', rootElement)
    let parentElement = current.$isNode ? current.$element : rootElement
    // info('PARENT ELEMENT IS ', rootElement)
    let currentNodes = current.$nodes
    let newLen = newNodes.length
    // if (!parent.$nodes) console.trace(parent)
    let curLen = current.$nodes.length
    let added = newLen >= curLen
    let len = added ? curLen : newLen

    let lastElement
    let index = 0
    for (; index < len; index++) {
        let curNode = currentNodes[index]
        let newNode = newNodes[index]

        if (newNode.$isText) {
            if (curNode.$isText && !newNode.$element) {
                // Text - Text
                // info('Text - Text', curNode.$text, newNode.$text)
                if (curNode.$text !== newNode.$text) {
                    curNode.$element.textContent = newNode.$text
                }
                newNode.$element = curNode.$element
            } else {
                //info('Text - Not Text')
                // Text - VNode/View
                newNode.$element = document.createTextNode(newNode.$text)
                let curElement = digElement(curNode)
                parentElement.insertBefore(newNode.$element, curElement)
                // curElement.insertAdjacentElement('beforeBegin', newNode.$element)
                curElement.remove()
            }
            continue
        }
        if (newNode.$isNode) {
            if (curNode.$isNode && (curNode.$tag === newNode.$tag) && !newNode.$element) {
                // VNode - VNode
                // info("VNode - VNode / tags equal", curNode.$element, newNode)
                updateAttributes(newNode.attrs, curNode.attrs, curNode.$element)
                newNode.$element = curNode.$element
                newNode.$element.__node__ = newNode.$element
                lastElement = newNode.$element
                if (!newNode.$element) {
                    trace('Regression: current node has no $element', curNode, newNode)
                }
                // VNode children
                patchNodes(curNode, newNode.$nodes, curNode.$element)
            } else {
                // VNode - Different
                // info("VNode - VNode - different Tags", curNode.$tag, newNode.$tag)
                let curElement = lastElement || digElement(curNode)
                if (!newNode.$element)
                    newNode.$element = renderDom(newNode, curElement)
                else {
                    error('NEW NODE HAS ELEMENT', newNode.$element)
                }
                if (!curElement) {
                    // warn('NO CURRENT ELEMENT', newNode)
                    rootElement.append(newNode.$element)
                } else {
                    // info('insert ',newNode.$element.tagName, ' before ', curElement.tagName, ' parent ', rootElement)
                    // parentElement.insertBefore(newNode.$element, curElement)
                    // curElement.insertAdjacentElement('afterEnd', newNode.$element)
                    parentElement.replaceChild(newNode.$element,curElement)
                    // curElement.remove()
                }
            }
            lastElement = newNode.$element
            continue
        }
        if (newNode.$isView) {
            if (curNode.$isView && (curNode.$name === newNode.$name)) {
                // View - View
                // error('View - View')
                newNodes[index] = curNode
                curNode.$parent = current

                if (isViewDirty(curNode, newNode.props)) {
                    // View is dirty -> update instance & patch nodes
                    // apply new props & children
                    curNode.$updateInstance(newNode.props, newNode.$children)
                    updateViewRoot(curNode)
                }
            } else {
                // error('View - NOT View')
                // requestAnimationFrame(()=>{
                    newNode.$nodes = renderDomView(newNode, rootElement)
                    let curElement = digElement(curNode)
                    // info(curElement, newNode.$element)
                    curElement.replaceWith(newNode.$element)
                // })
            }
        } else {
            trace('WTH is this?', newNode)
            throw Error('Illegal node')
        }

    }
    if (added) {
        // console.log('ADDING', curLen, newLen)

        if (newLen-index > 50) {
            // requestAnimationFrame(()=>{
                let ch = []
                for (let i = index; i < newLen; i++) {
                    let render = renderDom(newNodes[i], current.$rootElement)
                    ch.push(render)
                }
                let temp = document.createElement('slot')
                temp.style.display = 'none'
                // console.log(par)
                parentElement.append(temp)
                temp.replaceWith.apply(temp, ch)
            // })
        } else {
            for (let i = index; i < newLen; i++) {
                let render = renderDom(newNodes[i], current.$rootElement)
                parentElement.append(render)
            }
        }

    }
    if (curLen > newLen) {
        let nodes = current.$nodes
        // info('REMOVING', curLen-newLen-1)
        for (let i = index; i < curLen; i++) {
            // info('REMOVE', nodes[i])
            nodes[i].$removeDom()
        }
    }
    // info('PARENT DONE', rootElement)
}