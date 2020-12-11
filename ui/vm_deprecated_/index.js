import {VNode} from "./vnode";
import {View} from "./view";
import {render} from "./render";
import {renderDom} from "./render-dom";

export const Exir = {
    View: View,
    createView: View.create,
    createElement: VNode.create,
    render: render,
    renderDom: renderDom,
    mount: function mount(app, targetElement) {
        renderDom(render(app), targetElement)
    }
}

export const jsx = VNode.create

export default {
    Exir,
    jsx
}