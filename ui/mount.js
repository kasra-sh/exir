import {renderDom} from "./render";
import VNode from "./vnode";

export default function mount(template, element) {
    if (!element) throw Error('mount: target element is undefined')
    if (!template.$isNode) template = VNode.create(template).$render()
    renderDom(template, element, true)
}