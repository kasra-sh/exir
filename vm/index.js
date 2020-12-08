import View from "./view";
import VNode from "./vnode";
import mount from "./mount"
import H from "./hscript-minimal"
import {renderDom} from "./render";
/**
 * @type {function(*, *=): View}
 */
export const createComponent = View.create
/**
 * @type {function(*, *=): [VNode]}
 */
export const jsx = VNode.create

/**
 * @type {function(*, *=)}
 */

global.Exir = {
    View, VNode, jsx, mount, createComponent, render:renderDom
}
global.v = {...H, jsx, h:jsx}

export default {
    createComponent, jsx, mount
}