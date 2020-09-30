const I = require("../core/collections");
const L = require("../core/logging");
const DOM = require("../dom");

HTMLElement.prototype.$class = Element.prototype.$class = Node.prototype.$class = function $class() {
    return DOM.cls(this)
};

HTMLElement.prototype.$addClass = Element.prototype.$addClass = Node.prototype.$addClass = function $addClass(c) {return DOM.addClass(this, c)};

HTMLElement.prototype.$removeClass = Element.prototype.$removeClass = Node.prototype.$removeClass = function $removeClass(c) {return DOM.removeClass(this, c)};

HTMLElement.prototype.$toggleClass = Element.prototype.$toggleClass = Node.prototype.$toggleClass = function $toggleClass(c) {return DOM.toggleClass(this, c)};

HTMLElement.prototype.$hasClass = Element.prototype.$hasClass = Node.prototype.$hasClass = function $hasClass(c) {return DOM.hasClass(this, c)};

HTMLElement.prototype.$attrs = Element.prototype.$attrs = Node.prototype.$attrs = function $attrs() {return DOM.attrs(this)};

HTMLElement.prototype.$setAttr = Element.prototype.$setAttr = Node.prototype.$setAttr = function $setAttr(a, v) {DOM.setAttr(this, a, v)};

HTMLElement.prototype.$setAttr = Element.prototype.$setAttr = Node.prototype.$setAttr = function $setAttr(a, v) {DOM.setAttr(this, a, v)};

HTMLElement.prototype.$event = Element.prototype.$event = Node.prototype.$event = function $event(names, func, opt) {
    DOM.setEvent(this, names, func, opt);
};

HTMLElement.prototype.$clearEvent = Element.prototype.$clearEvent = Node.prototype.$clearEvent = function $clearEvent(names) {
    DOM.clearEvent(this, names);
};

HTMLElement.prototype.$style = Element.prototype.$style = Node.prototype.$style = function $style(prop, value) {
    DOM.style(this, prop, value)
};


Array.prototype.$addClass = HTMLCollection.prototype.$addClass = NodeList.prototype.$addClass = function $addClass(c) {
    I.forEach(this, (e)=>DOM.addClass(e, c))
};

Array.prototype.$removeClass = HTMLCollection.prototype.$removeClass = NodeList.prototype.$removeClass = function $removeClass(c) {
    I.forEach(this, (e)=>DOM.removeClass(e, c))
};

Array.prototype.$toggleClass = HTMLCollection.prototype.$toggleClass = NodeList.prototype.$toggleClass = function $toggleClass(c) {
    I.forEach(this, (e)=>DOM.toggleClass(e, c))
};

Array.prototype.$haveClass = HTMLCollection.prototype.$haveClass = NodeList.prototype.$haveClass = function $haveClass(c) {
    return I.all(this, (e)=>DOM.hasClass(e, c));
};

Array.prototype.$setAttr = HTMLCollection.prototype.$setAttr = NodeList.prototype.$setAttr = function $setAttr(a, v) {
    I.forEach(this, (e)=>DOM.setAttr(e, a, v));
};

Array.prototype.$haveAttr = HTMLCollection.prototype.$haveAttr = NodeList.prototype.$haveAttr = function $haveAttr(a, v) {
    I.all(this, (e)=>DOM.hasAttr(e, a, v));
};

Array.prototype.$event = HTMLCollection.prototype.$event = NodeList.prototype.$event = function $event(names, func, opt) {
    I.forEach(this, function (e) {
        DOM.setEvent(e, names, func, opt);
    });
};

Array.prototype.$clearEvent = HTMLCollection.prototype.$clearEvent = NodeList.prototype.$clearEvent = function $clearEvent(names) {
    I.forEach(this, function (e) {
        DOM.clearEvent(e, names);
    });
};

Array.prototype.$style = HTMLCollection.prototype.$style = NodeList.prototype.$style = function $style(prop, value) {
    forEach(this, (v)=>{
        DOM.style(v, prop, value)
    })
};
