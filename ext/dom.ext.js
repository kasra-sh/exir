const I = require("../core/collections");
const L = require("../core/logging");
const DOM = require("../dom");

function $class() {
    return DOM.cls(this)
};

function $addClass(c) {return DOM.addClass(this, c)};

function $removeClass(c) {return DOM.removeClass(this, c)};

function $toggleClass(c) {return DOM.toggleClass(this, c)};

function $hasClass(c) {return DOM.hasClass(this, c)};

function $attrs() {return DOM.attrs(this)};

function $setAttr(a, v) {DOM.setAttr(this, a, v)};

function $setAttr(a, v) {DOM.setAttr(this, a, v)};

function $event(names, func, opt) {
    DOM.setEvent(this, names, func, opt);
};

function $clearEvent(names) {
    DOM.clearEvent(this, names);
};

function $style(prop, value) {
    DOM.style(this, prop, value)
};


function $addClass(c) {
    I.forEach(this, (e)=>DOM.addClass(e, c))
};

function $removeClass(c) {
    I.forEach(this, (e)=>DOM.removeClass(e, c))
};

function $toggleClass(c) {
    I.forEach(this, (e)=>DOM.toggleClass(e, c))
};

function $haveClass(c) {
    return I.all(this, (e)=>DOM.hasClass(e, c));
};

function $setAttr(a, v) {
    I.forEach(this, (e)=>DOM.setAttr(e, a, v));
};

function $haveAttr(a, v) {
    I.all(this, (e)=>DOM.hasAttr(e, a, v));
};

function $event(names, func, opt) {
    I.forEach(this, function (e) {
        DOM.setEvent(e, names, func, opt);
    });
};

function $clearEvent(names) {
    I.forEach(this, function (e) {
        DOM.clearEvent(e, names);
    });
};

function $style(prop, value) {
    forEach(this, (v)=>{
        DOM.style(v, prop, value)
    })
};
