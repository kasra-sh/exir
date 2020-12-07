/////////////////////////////////////////////
///////// Performance Critical Code /////////
/////////////////////////////////////////////
import {prepareChildren} from "./util";
import {VNode} from "./vnode";
import {isStr} from "../core";

export function render(node, rootView) {
    // if (node.$name === 'App') console.log('APP',rootView, node.$root)
    // rootView = rootView || node.$root
    // if (node.$isView && !rootView) {
    //     rootView = undefined
    // }
    rootView = rootView || node.$root
    if (isStr(node)) {
        node = VNode.createText(node)
        node.$root = rootView
        return node
    }
    // rootView = rootView || (node.$isView?node:(node.$root||View.create('anonymous', {render:()=>node})))
    // if (!rootView) {
    //     console.log('no root view',node)
    // }
    if (node.$isView) {
        return renderView(node, rootView)
    }
    if (node instanceof Function) {
        return render(node(), rootView)
    }
    if (node.nodes) {
        node.nodes=node.nodes.map((n)=>{
            return render(n, rootView)
        })
    }
    node.$root = rootView
    return node
}

export function renderView(view, rootView) {
    // if (view.$name === 'App') console.log('APP',rootView, view.$root)
    rootView = rootView || view.$root
    try {
        let rendered = view.render.call(view, view.props)
        view.$node = rendered
        // view.$root = view === rootView?undefined:rootView
        // view.$root = rootView
        if (view.onCreate) view.onCreate.call(view)
        if (rendered.$isView) return renderView(rendered, view)
        // set component as fragment
        if (rendered.$isFrag) view.$isFrag = true
        // rendered.$root = rootView
        if (rendered.nodes) {
            rendered.nodes = prepareChildren(rendered.nodes, render, rootView)
        }
        // view.$root = rootView
        return view
    } catch (e) {
        console.log(view, e)
    }

}