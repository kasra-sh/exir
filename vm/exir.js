import View from "./view";
import VNode from "./vnode";
import mount from "./mount"

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
// export mount

export default {
    createComponent, jsx, mount
}