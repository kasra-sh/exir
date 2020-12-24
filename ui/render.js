const {error} = require("../core/logging");
const {flatMap} = require("../core/collections");
const {createNode} = require("./vnode");
const {normalize, setElementProps} = require("./utils");
const {createText} = require("./vnode");

function createElement(tag, attrs, events, parentView) {
    let el = document.createElement(tag);
    setElementProps(el, attrs, events, parentView);
    return el;
}

function createTextDom(text) {
    return document.createTextNode(text);
}

function createViewDom(view, rootElement) {
    if (view.beforeMount) {
        try {
            view.beforeMount.call(view);
        } catch (e) {
            setTimeout(error('(' + view.$name + ').beforeMount', e));
        }
    }
    if (!view.$nodes) {
        view.$renderAndSetNodes();
    }
    view.$rootElement = rootElement;
    let elements = view.$nodes.map(ch => ch.$isView ? createViewDom(ch, rootElement) : createNodeDom(ch, view));
    if (view.Mounted) {
        setTimeout(function () {
            try {
                view.Mounted.call(view);
            } catch (e) {
                error('(' + view.$name + ').Mounted', e)
            }
        }, 0);
    }
    return elements
}

function createNodeDom(node, parentView) {
    if (node.isText) {
        node.element = createTextDom(node.text);
        node.element.__node = node;
        return node.element;
    }

    node.element = createElement(node.tag, node.attrs, node.events, parentView);

    node.element.__node = node;

    if (!node.isEmpty) {
        let el = node.children.map(c => createDom(c, parentView, node.element));
        HTMLElement.prototype.append.apply(node.element, normalize(el, {createText, parent: this}))
    }

    return node.element;
}

function createDom(node, parentView, rootElement) {
    return node.$isView ? createViewDom(node, rootElement) : createNodeDom(node, parentView)
}

function render(view, rootElement) {
    if (!rootElement) throw Error('render(): rootElement is undefined');
    let current = rootElement.__view;
    if (current) {
        console.error('already rendered');
        return;
    }
    view.$rootElement = rootElement
    rootElement.innerHTML = "";
    let els = createDom(view, view, rootElement);
    if (!(els instanceof Array)) els = [els];
    els = flatMap(els)
    for (let i = 0; i < els.length; i++) {
        Node.prototype.appendChild.call(rootElement, els[i])
    }
    rootElement.__view = view
}

module.exports = {render, createDom, createNodeDom, createViewDom, createTextDom, createElement}