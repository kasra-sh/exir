/////////////////////////////////////////////
///////// Performance Critical Code /////////
/////////////////////////////////////////////
import {forEach} from "../core/collections";
import {compileStyles} from "./util";
import {setEvent} from "../dom/event";
import {render} from "./render";

function setElementProps(element, node, view) {
    if (node.attrs) {
        forEach(node.attrs, (val, key) => {
            if (key === 'style') {
                val = compileStyles(val, ' ')
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

/**
 * create Dom element(s) and set VNode.target
 * fragment must have parent div
 *
 * @param node
 * @param element
 * @param view
 * @returns {HTMLElement|Element|Node}
 */
export function renderDom(node, element, view) {
    let nodeIsView = false
    if (node.$isView) {
        nodeIsView = true
        if (!node.$node) {
            node = render(node, view)
        }
        view = node
        node = view.$node
    }
    if (node.$isFrag) {
        if (!element) {
            console.trace('fragment has no parent Element')
            element = document.createElement('div')
        }
        // node.$root = view
        node.target = element
        element.__node__ = view
        // if (view) view.target = element
        // renderDomChildren(node, element, view)
        if (node.nodes) {
            for (const child of node.nodes) {
                if (child.$isFrag) {
                    // fragment child
                    renderDom(child, element, node)
                } else {
                    element.append(renderDom(child, undefined, view))
                }
            }
        }
        // //
        if (nodeIsView && view.onMount) {
            view.onMount.call(view)
            view.target = element
            // element.__node__ = view
        }
        return element
    }

    if (node.isText) {
        element = document.createTextNode(node.text)
        node.target = element
        return element
    }

    if (!element) {
        element = document.createElement(node.$tag)
    }

    node.target = element
    // if (view) view.target = element
    element.__node__ = nodeIsView?view:node

    if (!node.$isFrag) setElementProps(element, node, view)
    else console.error('render-dom: something broke!',node)
    // renderDomChildren(node, element, view)
    if (node.nodes) {
        for (const child of node.nodes) {
            if (child.$isFrag) {
                // fragment child
                renderDom(child, element, view)
                // child.$root = node
            } else {
                element.append(renderDom(child, undefined, view))
                // child.$root = node
            }
        }
    }
    if (nodeIsView) {
        view.target = element
        view.$isDirty = false
        if (view.onMount) setTimeout(()=>view.onMount.call(view), 0)
    }
    return element
}

function renderDomChildren(node, element, view) {
    if (node.nodes) {
        for (const child of node.nodes) {
            if (child.$isFrag) {
                // fragment child
                renderDom(child, element, view)
            } else {
                element.append(renderDom(child, undefined, view))
            }
        }
    }
}