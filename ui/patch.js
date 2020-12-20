// import {updateAttributes, updateEventListeners} from "./update-element";
// import renderDom, {renderDomView} from "./render";
// import View from "./view";
// import {error, trace, warn} from "../core/logging";
// import {normalizeNodes} from "./util";
const {updateAttributes, updateEventListeners} = require("./update-element");
const {renderDom, renderDomView} = require("./render");
const {error, trace, warn} = require("../core/logging");
const normalizeNodes = require("./normalizeNodes");
const View = require("./view_base");

function updateViewRoot(view) {
    let newNodes = normalizeNodes(View.$callRender(view), view, view, true);
    patchNodes(view, newNodes, view.$rootElement);
    View.$setNodes(view, newNodes, false);
    view.$isDirty = false;
    view.$dispatchLifeCycle('onUpdate', view.props);
}

function isViewDirty(view, props) {
    if (view.$isView) {
        return view.shouldUpdate(props);
    } else return true;
}


function digElement(currentNode) {
    let element = undefined;
    if (currentNode.$element) {
        return currentNode.$element;
    } else {
        let nodes = currentNode.$nodes;
        for (let i = 0; i < nodes.length; i++) {
            if (element) {
                nodes[i].$removeDom();
            } else {
                element = digElement(nodes[i]);
                if (element) nodes[i].$element = undefined;
            }
        }
    }
    return element;
}

function patchNodes(current, newNodes, rootElement) {
    let parentElement = current.$isNode ? current.$element : rootElement;
    let currentNodes = current.$nodes;
    let newLen = newNodes.length;
    let curLen = current.$nodes.length;
    let added = newLen >= curLen;
    let len = added ? curLen : newLen;

    let lastElement;
    let index = 0;
    for (; index < len; index++) {
        let curNode = currentNodes[index];
        let newNode = newNodes[index];
        if (newNode.$isText) {
            if (curNode.$isText && !newNode.$element) {
                // Text - Text
                if (curNode.$text !== newNode.$text) {
                    curNode.$element.textContent = newNode.$text;
                }
                newNode.$element = curNode.$element;
            } else {
                // Text - VNode/View
                newNode.$element = document.createTextNode(newNode.$text);
                let curElement = digElement(curNode);
                parentElement.insertBefore(newNode.$element, curElement);
                // curElement.insertAdjacentElement('beforeBegin', newNode.$element)
                curElement.remove();
            }
            continue
        }
        if (newNode.$isNode) {
            if (curNode.$isNode && (curNode.$tag === newNode.$tag) && !newNode.$element) {
                // VNode - VNode
                newNode.$element = curNode.$element;
                newNode.$element.__node__ = newNode;
                newNode.$view = curNode.$view;
                lastElement = newNode.$element;
                updateAttributes(newNode.attrs, curNode.attrs, curNode.$element);
                updateEventListeners(newNode.events, curNode.events, lastElement);
                if (!newNode.$element) {
                    error('Fatal: current node has no $element', curNode, newNode);
                }
                // VNode children
                patchNodes(curNode, newNode.$nodes, curNode.$element);
            } else {
                // VNode - Different
                let curElement = lastElement || digElement(curNode);
                if (!newNode.$element)
                    newNode.$element = renderDom(newNode, curElement);
                else {
                    warn('Do not store and reuse tags, ' +
                        'instead generate them dynamically from state or other sources of data.', newNode.$element);
                }
                if (!curElement) {
                    // warn('NO CURRENT ELEMENT', newNode)
                    rootElement.append(newNode.$element);
                } else {
                    parentElement.replaceChild(newNode.$element,curElement);
                    // parentElement.insertBefore(newNode.$element, curElement)
                    // curElement.insertAdjacentElement('afterEnd', newNode.$element)
                    // curElement.remove()
                }
            }
            lastElement = newNode.$element;
            continue
        }
        if (newNode.$isView) {
            if (curNode.$isView && (curNode.$name === newNode.$name)) {
                // View - View
                newNodes[index] = curNode;
                curNode.$parent = current;

                if (isViewDirty(curNode, newNode.props)) {
                    // View is dirty -> update instance & patch nodes
                    // apply new props & children
                    curNode.$updateInstance(newNode.props, newNode.$children);
                    updateViewRoot(curNode);
                }
            } else {
                // requestAnimationFrame(()=>{
                    newNode.$nodes = renderDomView(newNode, rootElement);
                    let curElement = digElement(curNode);
                    curElement.replaceWith(newNode.$element);
                // })
            }
        } else {
            trace('Unexpected node', newNode);
            throw Error('Illegal node');
        }

    }
    if (added) {
        if (newLen-index > 50) {
            // requestAnimationFrame(()=>{
                let ch = [];
                for (let i = index; i < newLen; i++) {
                    let render = renderDom(newNodes[i], current.$rootElement);
                    ch.push(render);
                }
                let temp = document.createElement('slot');
                temp.style.display = 'none';
                parentElement.append(temp);
                temp.replaceWith.apply(temp, ch);
            // })
        } else {
            for (let i = index; i < newLen; i++) {
                let render = renderDom(newNodes[i], current.$rootElement);
                parentElement.append(render);
            }
        }

    }
    if (curLen > newLen) {
        let nodes = current.$nodes;
        for (let i = index; i < curLen; i++) {
            nodes[i].$removeDom();
        }
    }
}

module.exports = {
    updateViewRoot,
    patchNodes
}