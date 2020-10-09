import {render} from "./renderer";
import {VNode} from "./vnode";
import {Component} from "./component";
import {$$} from "../dom";


function mount(rootElement, component, force = false) {
    rootElement = $$(rootElement)[0];
    if (rootElement.__X_VDOM__ && !force) {
        console.log("must patch", component);
        return;
    }
    rootElement.__X_VDOM__ = true;
    console.log(rootElement);
    let rendered = render(component, {});
    // console.log("Rendered", rendered);
    // console.log("Component", component);
    rootElement.append(rendered);
}

module.exports = {mount, VNode, Component}