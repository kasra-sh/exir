/**
 * @module DOM
 * @memberOf dom
 */

const {isUnd, isStr} = require("../core/types")
const {filter, contains} = require("../core/collections")

const emptyStyle = ['', 'initial', 'unset', undefined, null];

/**
 * Set style / Get style / Get all styles
 * @param {HTMLElement|Element|Node} e - element/node
 * @param {String} [p] - style property name
 * @param {String} [v] - style property value
 * @return {Array|Object|String|*|string}
 */
function style(e, p, v) {
    if (isUnd(p)) {
        // let stl = {};
        let cs = getComputedStyle(e);
        cs = filter(cs, (s, n) => isStr(n)&&!contains(emptyStyle, s))
        // ForEach(cs, (s) => stl[s] = cs[s]);
        return cs
    }
    if (isUnd(v)) return e.style[p] || getComputedStyle(e)[p];
    e.style[p] = v;
}

/**
 * Element has style property
 * @param {HTMLElement|Element|Node} e - element/node
 * @param {String} p - style property name
 * @return {boolean}
 */
function hasStyle(e, p) {
    let s = style(e, p);
    return !contains(emptyStyle, s)
}

module.exports = {style, hasStyle}