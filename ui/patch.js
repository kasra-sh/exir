// const {randomId} = require("./utils");
const {dispatchTask, scheduler} = require("./scheduler");
const {createDom, createNodeDom, createViewDom, createChildrenDom} = require("./render");
const {error} = require("../core/logging");
const {patchAttrs, patchEvents} = require("./patch-element");
const {createText, createNode} = require("./vnode");
const {normalize, sameProps} = require("./utils");

function updateView(view) {
    // view.$isDirty = true;
    dispatchTask(() => {
        patchView(view, view.props, view.$children);
        // view.$isDirty = false;
    }, view)
}

function patchView(view, props, children) {
    if (view.shouldUpdate) {
        try {
            if (!view.shouldUpdate.call(view, {oldProps: view.props, newProps: props})) return;
        } catch (e) {
            setTimeout(error('(' + view.$name + ').shouldUpdate', e), 0);
        }
    } else {
        if (!view.$isDirty) return;
    }
    if (view.beforeUpdate) {
        try {
            view.beforeUpdate.call(view, props);
        } catch (e) {
            setTimeout(error('(' + view.$name + ').Updated', e));
        }
    }
    view.$updateWith(props, children);
    const newNodes = view.$renderNodes();
    view.$nodes = patchNodes(newNodes, view.$nodes, view, view.$rootElement);
    view.$isDirty = false;
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
        _new.element.__node = _new;
        _cur.element = null;
        if (!sameProps(_cur.props, _new.props)) {
            // console.log('PATCH', _cur.tag)
            patchAttrs(_new.attrs, _cur.attrs, _new.element);
            patchEvents(_new.events, _cur.events, _new.element);
        }
        if (!_new.element) {
            error('Fatal: current node has no element', _cur, _new);
        }
        // VNode children
        // dispatchTask(()=>patchNodes(_new.children, _cur.children, view, _new.element))
        patchNodes(_new.children, _cur.children, view, _new.element)
    } else {
        // console.log('REPLACE', _cur.tag, _new.tag);
        _new.element = createNodeDom(_new, view);
        _cur.element.replaceWith(_new.element);
        _new.element.__node = _new;
    }

}

function patchText(_new, _cur) {
    if (_new.text !== _cur.text) {
        _cur.element.nodeValue = _new.text;
    }
    _new.element = _cur.element;
    _new.element.__node = _new;
}

function swapElements(_new, _cur) {
    let curSlot = createNodeDom(createNode('div', {style: 'display: none'}));
    let curNodes = _cur.$isView ? _cur.$elements : [_cur.element];
    let newNodes = _new.$isView ? _new.$elements : [_new.element];
    curNodes[0].insertAdjacentElement('beforeBegin', curSlot);
    newNodes[0].replaceWith(...curNodes);
    curSlot.replaceWith(...newNodes);
}

function patchOrReplaceView(_new, _cur, newNodes, currentNodes, idx, curLen, newLen, parentView, rootElement) {
    let keysMatch = false;
    if (_new.props.key !== undefined) {
        let prev = -1;
        for (let i = idx; i < curLen; i++) {
            if (currentNodes[i].props.key === _new.props.key) {
                prev = i;
                keysMatch = true;
                break;
            }
        }
        if (prev > idx) {
            // _cur === currentNodes[idx]
            // if ((newLen<curLen && prev > curLen))
            swapElements(currentNodes[prev], currentNodes[idx])
            // set current as prev
            currentNodes[idx] = currentNodes[prev];
            // set prev as _cur
            currentNodes[prev] = _cur;
            _cur = currentNodes[idx];
        }
    }

    if ((_cur.$name === _new.$name) && (keysMatch)) {
        patchView(_cur, _new.props, _new.$children);
        _cur.$parent = _new.$parent;
        _new.$parent = undefined;
        newNodes[idx] = _cur;
    } else {
        // console.log(idx, _cur, _new)
        let anchor = _cur.$destroy(true);
        if (_new.$isView) {
            let el = createViewDom(_new, rootElement);
            Element.prototype.replaceWith.apply(anchor, el);
        } else {
            let el = createNodeDom(_new, parentView);
            anchor.replaceWith(el);
            _new.element = el;
            _new.element.__node = _new;
        }

    }

}

function replaceNodes(_new, _cur, parentView, rootElement) {
    const el = createDom(_new, parentView, rootElement);
    let anchor = undefined;
    if (_cur.isNode || _cur.isText) {
        anchor = _cur.element;
    } else {
        anchor = _cur.$destroy(true);
    }
    if (anchor) {
        Element.prototype.replaceWith.apply(anchor, el instanceof Array ? el : [el]);
        _new.element = el;
        _new.element.__node = _new;
    } else {
        console.error('Empty anchor', _cur);
    }
}

function patchNodes(newNodes, currentNodes, parentView, rootElement) {
    if (!rootElement) throw Error('patchNodes: rootElement is not defined');
    let newLen = newNodes.length;
    let curLen = currentNodes.length;
    let added = newLen > curLen;
    let len = added ? curLen : newLen;
    let idx = 0;
    for (; idx < len; idx++) {
        const _cur = currentNodes[idx];
        const _new = newNodes[idx];
        if (_cur.$t === _new.$t) {
            if (_cur.isNode) {
                patchNode(_new, _cur, parentView)
                continue;
            }
            if (_cur.isText) {
                patchText(_new, _cur)
                continue;
            }
            patchOrReplaceView(_new, _cur, newNodes, currentNodes, idx, curLen, newLen, parentView, rootElement);
        } else {
            replaceNodes(_new, _cur, parentView, rootElement);
        }
    }
    if (added) {
        let elements = createChildrenDom(newNodes.slice(idx), parentView, rootElement);
        HTMLElement.prototype.append.apply(rootElement, elements)
    } else if (curLen > newLen) {
        for (let i = idx; i < curLen; i++) {
            currentNodes[i].$destroy();
        }
    }
    return newNodes;
}

module.exports = {patchView, updateView}