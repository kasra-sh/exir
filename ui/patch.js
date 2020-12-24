const {createDom} = require("./render");
const {createNodeDom} = require("./render");
const {error} = require("../core/logging");
const {patchAttrs, patchEvents} = require("./patch-element");
const {concat} = require("../core/collections");
const {createText} = require("./vnode");
const {normalize} = require("./utils");

function patchView(view, props, children) {
    if (view.shouldUpdate) {
        try {
            if (!view.shouldUpdate.call(view, {oldProps: view.props, newProps: props})) return;
        } catch (e) {
            setTimeout(error('('+view.$name+').shouldUpdate', e),0);
        }
    }
    if (view.beforeUpdate) {
        try {
            view.beforeUpdate.call(view, props);
        } catch (e) {
            setTimeout(error('('+view.$name+').Updated', e));
        }
    }
    view.$children = normalize(children, {createText})
    concat(view.props, props || {});
    const newNodes = view.$renderNodes();
    view.$nodes = patchNodes(newNodes, view.$nodes, view, view.$rootElement);
    if (view.Updated) {
        setTimeout(function () {
            try {
                view.Updated.call(view);
            } catch (e) {
                error('(' + view.$name + ').Updated', e)
            }
        }, 0);
    }
}

function patchNode(_new, _cur, view) {
    if (_new.tag === _cur.tag) {
        _new.element = _cur.element;
        // _cur.element = undefined;
        _new.element.__node = _new;
        patchAttrs(_new.attrs, _cur.attrs, _cur.element);
        patchEvents(_new.events, _cur.events, _new.element);
        if (!_new.element) {
            error('Fatal: current node has no element', _cur, _new);
        }
        // VNode children
        patchNodes(_new.children, _cur.children, view, _new.element);
    } else {
        _new.element = createNodeDom(_new, view);
        _cur.element.replaceWith(_new.element);
        _new.element.__node = _new;
    }

}

function patchText(_new, _cur) {
    if (_new.text !== _cur.text) {
        _cur.element.textContent = _new.text;
    }
    _new.element = _cur.element;
    _new.element.__node = _new;
}

function patchNodes(newNodes, currentNodes, parentView, rootElement) {
    if (!rootElement) throw Error('patchNodes: rootElement is not defined');
    let newLen = newNodes.length;
    let curLen = currentNodes.length;
    let added = newLen >= curLen;
    let len = added ? curLen : newLen;
    let idx = 0;
    for (; idx < len; idx++) {
        const _cur = currentNodes[idx];
        const _new = newNodes[idx];
        if (_cur.$t === _new.$t) {
            if (_cur.isNode) {
                patchNode(_new, _cur, parentView);
                continue;
            }
            if (_cur.isText) {
                patchText(_new, _cur);
                continue;
            }
            if (_cur.$name === _new.$name) {
                patchView(_cur, _new.props, _new.$children);
                _cur.$parent = _new.$parent;
                _new.$parent = undefined;
                newNodes[idx] = _cur;
            } else {
                const el = createDom(_new, parentView, rootElement);
                let anchor = undefined;
                anchor = _cur.$destroy(true);
                Element.prototype.replaceWith.apply(anchor, el);
                _new.element = el;
            }
        } else {
            const el = createDom(_new, parentView, rootElement);
            let anchor = undefined;
            if (_cur.isNode || _cur.isText) {
                anchor = _cur.element;
            } else {
                anchor = _cur.$destroy(true);
            }
            if (anchor) {
                Element.prototype.replaceWith.apply(anchor, el);
                _new.element = el;
            } else {
                console.error('Empty anchor', _cur);
            }
        }
    }
    if (added) {
        for (let i = idx; i < newLen; i++) {
            let render = createDom(newNodes[i], parentView, rootElement);
            rootElement.append(render);
        }
    } else if (curLen > newLen) {
        for (let i = idx; i < curLen; i++) {
            currentNodes[i].$destroy();
        }
    }
    return newNodes;
}

module.exports = {patchView}