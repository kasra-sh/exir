/////////////////////////////////////////////
///////// Performance Critical Code /////////
/////////////////////////////////////////////
import {updateAttributes} from "./update-attrs";
import {renderDom} from "./render-dom";
import {View} from "./view";
import {concat, isStr} from "../core";
import {VNode} from "./vnode";
import {prepareChildren} from "./util";
import {render} from "./render";
export function isDirty(node, props) {
    // return true
    if (node.$isView) {
        return node.shouldUpdate && node.shouldUpdate(props)
    } else return true
}

function updateSingleNode(currentNode, newNode) {
    newNode.target = currentNode.target
    updateAttributes(newNode.attrs, currentNode.attrs, currentNode.target)
}

/**
 *
 * @param curNode
 * @param removeTarget
 * @returns {Node|HTMLElement}
 */
function extractFirstElement(curNode, removeTarget = true) {
    if (curNode.isText) return curNode.target
    if (!curNode.$isFrag) return curNode.$isView ? curNode.$node.target : curNode.target

    let curRealNode = curNode.$isView ? curNode.$node.nodes[0] : curNode.nodes[0]
    while (!curRealNode.target) {
        curRealNode = curRealNode.$isView ? curRealNode.$node.nodes : curRealNode.nodes[0]
    }
    let target = curRealNode.target
    // console.log('target cleard from', curRealNode.target)
    if (removeTarget) curRealNode.target = undefined
    return target;
}

export function updateViewNodes(currentNodes, newNodes, view, parentElement) {
    const newLen = newNodes.length
    const curLen = currentNodes.length
    const more = curLen < newLen;
    let newNodeList = []
    let newIndex = 0
    for (; newIndex < newLen; newIndex++) {
        if (more && newIndex === curLen) {
            break
        }
        const newNode = newNodes[newIndex]
        const curNode = currentNodes[newIndex]
        const curFrag = curNode.$isFrag
        const newFrag = newNode.$isFrag

        // LEFT : VIEW
        if (newNode.$isView) {
            // BOTH VIEW
            if (curNode.$isView/* && newNode.isView*/) {
                if (newNode.$name === curNode.$name) {
                    // console.log('both view')
                    if (!isDirty(curNode, newNode.props)) {
                        newNodes[newIndex] = curNode
                        continue
                    }
                    // pass props
                    // concat(curNode.props, newNode.props, true)
                    // update current with new props
                    updateView(curNode, newNode.props)
                    newNodes[newIndex] = curNode
                } else {
                    // console.log('both view names not match')
                    // different components
                    renderDom(render(newNode))
                    curNode.target.replaceWith(newNode.target)
                    curNode.target = undefined
                    // destroy([curNode])
                    curNode.$remove()
                }
            } else {
                let pivotElement = curFrag ? extractFirstElement(curNode) : curNode.target;

                if (newFrag) {
                    let newElement = renderDom(render(newNode), curFrag ? document.createElement('div') : pivotElement)
                    pivotElement.replaceWith(newElement)
                } else {
                    let rendered = render(newNode, view.$root)
                    pivotElement.replaceWith(renderDom(rendered.$node, undefined, rendered))
                }

                // destroy([curNode])
                curNode.$remove()
            }
            continue
        }

        // LEFT : VNODE
        if (newNode.$isNode) {
            // BOTH VNODE
            if (curNode.$isNode/* && newNode.isNode*/) {
                if (curNode.$tag === newNode.$tag) {
                    // console.log('tags equal', newNode.$tag)
                    if (!curFrag && !newFrag) {
                        // BOTH NON-FRAGMENT
                        // console.log('update single node', curNode.$tag)
                        updateSingleNode(curNode, newNode)
                    }
                    try {
                        // console.log('update children', curNode, newNode)
                        // PATCH CHILDREN
                        updateViewNodes(curNode.nodes, newNode.nodes, view, parentElement)
                    } catch (e) {
                        // console.log(newNode, curNode)
                        console.log(e)
                    }
                } else {
                    let rendered = renderDom((newNode))
                    curNode.target.replaceWith(rendered)
                }

            } else {
                // console.log('right not match node', newNode, curNode)

                // let pivotElement = curFrag ? extractFirstElement(curNode) : curNode.target;
                let pivotElement = extractFirstElement(curNode);
                // console.log('pivot', pivotElement)
                try {
                    if (newFrag) {
                        let newElement = renderDom(render(newNode), document.createElement('div'))
                        pivotElement.replaceWith(newElement)
                    } else {
                        pivotElement.replaceWith(renderDom(render(newNode)))
                    }
                    // console.log('after', newNode, curNode)
                    curNode.$remove()
                } catch (e) {
                    console.error(e)
                    // console.log(curNode, pivotElement)
                }

                // RIGHT NOT VNODE
            }
            continue
        }

        // LEFT TEXT
        if (newNode.text !== curNode.text) {
            // console.log('pivot text',pivotElement)
            // console.log(curNode,newNode)
            if (curNode.isText) {
                newNode.target = curNode.target
                curNode.target.textContent = newNode.text
            } else {
                let pivotElement = extractFirstElement(curNode);
                newNodes[newIndex] = render(newNode, undefined, view)
                pivotElement.replaceWith(renderDom(newNodes[newIndex]))
            }
        } else {
            newNode.target = curNode.target
        }
    }
    if (more) {
        let lastElement = newNodes[newIndex-1].$lastElement()
        let temp = document.createElement('div')
        temp.style.display = 'none'
        if (lastElement.nextSibling) {
            lastElement.parentElement.insertBefore(temp, lastElement.nextSibling)
            // lastElement = temp
        } else {
            lastElement.parentElement.append(temp)
        }
        for (let i = newIndex; i < newLen; i++) {
            let el = renderDom((newNodes[i]), undefined, view)
            newNodeList.push(el)
            newNodes[i].target = el
        }
        temp.replaceWith(...newNodeList)
        // setTimeout(()=>{}, 2000)
    } else if (newLen < curLen) {
        // let dels = currentNodes.slice(newLen, curLen - 1)
        for (let i = newLen; i < curLen; i++) {
            currentNodes[i].$remove()
        }
    }
    // console.log('New Nodes', newNodes)
}

export function updateView(view, newProps, newChildren) {
    // to render
    if (!isDirty(view, newProps)) return view
    if (newProps) {
        concat(view.props, newProps, true)
        view.$children = newChildren
    }

    // is dirty -> call render
    let newNode = view.render.call(view, view.props)
    let newNodes = newNode.$isFrag ? newNode.nodes : [newNode]
    view.$isFrag = newNode.$isFrag
    let currentNodes = view.$isFrag ? view.$node.nodes : [view.$node]
    if (newNode.$isView) {
        updateView(newNode, newNode.props, newNode.$children)
    }
    updateViewNodes(currentNodes, newNodes, view)
    view.$node = newNode
    view.$isDirty = false
    if (view.onUpdate) view.onUpdate.call(view)
    return view
}

export function destroy(nodes) {
    nodes.forEach(node => {
        if (node.$isView && node.onDestroy) {
            if (node.$isFrag) {
                destroy(node.$node.nodes)
            } else destroy([node.$node])
            node.onDestroy()
        }
        if (node.target) node.target.remove()
        if (node.nodes) {
            destroy(node.nodes)
        }
    })
}