// const {getAttr, setAttr, hasAttr} = require("../dom/attributes")
const {isUnd, isStr} = require("../core/types")
const {Filter, ForEach, contains} = require("../core/stream")

const emptyStyle = ['', 'initial', 'unset', undefined, null];

function style(e, p, v) {
    if (isUnd(p)) {
        // let stl = {};
        let cs = getComputedStyle(e);
        cs = Filter(cs, (s, n) => isStr(n)&&!contains(emptyStyle, s))
        // ForEach(cs, (s) => stl[s] = cs[s]);
        return cs
    }
    if (isUnd(v)) return e.style[p] || getComputedStyle(e)[p];
    e.style[p] = v;
}

function hasStyle(e, p) {
    let s = style(e, p);
    return !contains(emptyStyle, s)
}

module.exports = {style, hasStyle}