/**
 * @module dom
 * @memberOf dom
 */

const {contains} = require("../core/collections");

/**
 * @class
 * @see dom.parseQuery
 */
class QueryParams {
    constructor() {
        /** @type {String} */
        this.tag = ""
        /** @type {String|null} */
        this.id = null
        /** @type {String[]} */
        this.classes = []
    }
}

/**
 * Parse Jade-like query to an object containing tag, id and classes
 *
 * @param {String} query - A string containing jade-like tag, id and classes
 * @param {QueryParams} def - Default value if empty
 * @returns {QueryParams}
 *
 * @example
 *  parseQuery('div#root.main.container');
 *  // returns {tag: 'div', id: 'root', classes: ['main', 'container']}
 */
function parseQuery(query, def={}) {
    let params = new QueryParams();
    params.tag = "";
    query = query.trim();
    let hasHash = contains(query,"#");
    let hasDot = contains(query,".");
    if (hasDot || hasHash) {
        let sp = query.split('#');
        if (hasHash) {
            params.tag = sp[0].toUpperCase();
            if (!hasDot) {
                params.id = query.split("#")[1];
            }
        }
        if (hasDot) {
            let ic = (sp.length>1?sp[1]:sp[0]).split(".");
            if (!hasHash) {
                params.tag = ic[0].toUpperCase();
            } else {
                params.id = ic[0];
            }
            params.classes = ic.slice(1);
            if (params.classes.length>0) params.hasClass = true;
        }
    } else {
        params.tag = query.toUpperCase();
    }
    if (params.tag === "" || params.tag === undefined)
        params.tag = "div";

    return params;
}

module.exports = {parseQuery}