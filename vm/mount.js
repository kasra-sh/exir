import {renderDom} from "./render";

export default function mount(template, element) {
    if (!element) throw Error('mount: target element is undefined')
    renderDom(template, element, true)
    console.log(element)
}