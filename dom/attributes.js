const I = require("../core/stream")
const T = require("../core/types")

function getAttributes(e) {
    let atr = {};
    I.ForEach(e.getAttributeNames(), (n) => atr[n] = e.getAttribute(n));
    return atr;
}

function hasAttr(a, v) {
    if (this.element.hasAttribute(a)) {
        if (v) return this.element.getAttribute(a) === v
        return true
    }

    return false
}

function getAttr(e, a) {
    return e.getAttribute(a)
}

function setAttr(e, a, v) {
    if (T.isArr(a)) {
        I.ForEach(a, (n) => this.set(n, v))
    } else if (T.isObj(a)) {
        I.ForEach(a, (v, k) => this.set(k, v))
    } else {
        e.setAttribute(a, v);
    }
}

class Attributes {
    constructor(e) {
        this.element = e;
    }

    keys() {
        return this.element.getAttributeNames()
    }

    all() {
        return getAttributes(this.element);
    }

    set(a, v) {
        setAttr(this.element, a, v);
        return this;
    }

    get(a) {
        return getAttr(this.element, a)
    }

    has(a, v) {
        return hasAttr(a, v);
    }

    remove(a) {
        this.set(a, undefined);
    }
}

function attrs(e) {
    return new Attributes(e)
}

module.exports = {getAttributes, Attributes, getAttr, hasAttr, setAttr, attrs}