const scope = require("../core/scope");
const T = require("../core/types");
const I = require("../core/iter");
const A = require("./attributes");
const C = require("./classes");
const L = require("../core/logging");
const Q = require('./query')

function modifyNode(node, object) {
    if (!T.isVal(node)) {
        L.error(`Node is ${node}`);
    }
    if (T.hasField(object, 'attr')) {
        if (T.isObj(object['attr'])) {
            I.ForEach(object['attr'], (v, k, i)=>{
                A.setAttr(node, k, v);
            })
        }
    }
    if (T.hasField(object, 'cls')) {
        if (T.isObj(object['cls'])) {
            let c = C.cls(node);
            I.ForEach(object['cls'], (v, k, i)=>{
                c[k](v)
            })
        }
    }
    if (T.hasField(object, 'prop')) {
        if (T.isObj(object['prop'])) {
            I.ForEach(object['prop'], (v, k, i)=>{
                node[k] = v;
            })
        }
    }
}

function Append(parent, ...elements) {
    window.dispatchEvent(new CustomEvent("x.dom.append", {detail: {parent, elements}}))
    parent.append(elements);
}

function $event(target, event, listener, removeDups = true) {
    if (!scope.isBrowser()) {
        L.error("Events are browser only!");
        return
    }
    if (!T.isArr(event)) {
        if (I.contains(event,' ')) {
            event = event.split(' ').Map((it)=>it.trim())
        } else
            event = [event];
    }
    target.__EVENTS__ = target.__EVENTS__ || {};
    event.forEach(function (ev) {
        target.__EVENTS__[ev] = target.__EVENTS__[ev] || [];
        let f = function (e) {
            listener(e, target);
        };
        if (removeDups) {
            I.Filter(target.__EVENTS__[ev] = target.__EVENTS__[ev],(fl)=> {
                if (T.funcEqual(fl.l, listener)) {
                    target.removeEventListener(ev, fl.f);
                    return false
                }
            });
        }

        target.__EVENTS__[ev].push({f:f, l:listener});
        target.addEventListener(ev, f);
    });
}

$event(window, "load", function (){
    window.__WINLOADED__ = true;
});

function loaded(func) {
    if (global.__WINLOADED__) {
        func();
    } else {
        $event(window, "load", func);
    }
}

const ap = Node.prototype.append;
window.X_DOMAPPENDEVENT = "dom.append";
Node.prototype.append = function (c) {
    ap.call(this, c);
    window.dispatchEvent(new CustomEvent(window.X_DOMAPPENDEVENT, {detail: {target: this}}))
}

const apc = Node.prototype.appendChild;
Node.prototype.appendChild = function (c) {
    apc.call(this, c);
    window.dispatchEvent(new CustomEvent(window.X_DOMAPPENDEVENT, {detail: {target: this}}))
}

// Add tracking for addEventListener
const ael = Node.prototype.addEventListener;
HTMLElement.prototype.addEventListener = Element.prototype.addEventListener =
        Node.prototype.addEventListener = function (type, listener, options) {
    ael.call(this, type, listener, options);
    this.__EVENTS__ = this.__EVENTS__ || {};
    this.__EVENTS__[type] = this.__EVENTS__[type] || [];
    this.__EVENTS__[type].push({listener, options});
}

function defineEvent(selector, events) {
    let e = Q.$(selector)[0];
    I.ForEach(events, (v, k) => {
        $event(e, k, v);
    });
}
var a = {
    '.filan': {
        'click': function () {

        },
        'mouseout': function () {

        }
    }
}

module.exports = {modifyNode, Append, $event}