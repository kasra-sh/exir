/**
 * @module dom
 * @memberOf dom
 */

const {isEl, isEls, isStr, isVal} = require("../core/types");
const L = require("../core/logging");
const {cls} = require("../dom/classes");
//
// import {isEl, isEls, isStr, isVal} from "../core/types";
// import {error} from "../core/logging";
// import {cls} from "../dom/classes";
//
/**
 * jQuery-like select "all" by query accepts element, nodes or query
 * @param {String|HTMLElement|Element|Node|HTMLCollection|NodeList} q - query string
 * @param {HTMLElement|Element|Node} [root] - root which query is issued from
 * @return {Array}
 */
function $(q, root = document) {
    if (isEl(q)) return Array.of(q);
    if (isEls(q)) return Array.from(q);
    if (!isStr(q)) {
        L.error(`Query is not string nor element X.$(${q})`);
        return null;
    }
    if (!isEl(root)) {
        L.error(`Query root is not a node!\t[X.$(${q}, ${root})]`);
        return null;
    }
    return Array.from(root.querySelectorAll(q));
}

/**
 * jQuery-like select "one" by query accepts element, node or query
 * @param {String|HTMLElement|Element|Node} q - query string
 * @param {HTMLElement|Element|Node} [root] - root which query is issued from
 * @return {Array} - returns array of length=1
 */
function $$(q, root = document) {
    if (isEl(q)) return Array.of(q);
    if (!isStr(q)) {
        L.error(`Query is not string nor element X.$$(${q})`);
        return null;
    }
    if (!isEl(root)) {
        L.error(`Query root is not a node!\t[X.$(${q}, ${root})]`);
        return null;
    }
    return Array.of(root.querySelector(q));
}

/**
 * Generate relative query of given element/node
 * @param {HTMLElement|Element|Node} e - element/node
 * @param {HTMLElement|Element|Node} maxParent - parent where the query relates to
 * @return {String} - query relative to maxParent
 */
function queryOf(e, maxParent, q) {
    if ((!isVal(e) || !isEl(e))) {
        L.error(`\nQuery generator's first parameter must be Element/Node! CAUSE: X.queryOf(${e}, ${maxParent})`);
        return null;
    }
    maxParent = maxParent || document.body;
    let gen = e.tagName;
    q = q || "";

    if (e.id) {
        gen += e.id ? ('#' + e.id) : "";
        return gen + (!(q === "") ? ' ' + q : "");
    }

    cls(e).items.forEach(function (value) {
        gen = gen + (value !== '' ? '.' + value : '')
    });

    if (gen) {
        let sibs = $(gen, e.parentElement);
        if (sibs.length>1) {
            let idx = Array.from(e.parentElement.children).findIndex(function (i) {
                return e === i;
            });

            if (idx > 0) {
                gen = gen + ":nth-child("+(idx+1)+")";
            }
        }
    }
    if (e.parentElement && (e.parentElement !== maxParent) && e.parentElement !== document) {

        return (queryOf(e.parentElement, maxParent) + " > " + gen) + (!(q === "") ? ' ' + q : "");
    } else {
        return gen + (!(q === "") ? ' ' + q : "");
    }
}

module.exports = {$, $$, queryOf};