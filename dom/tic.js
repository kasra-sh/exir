const {contains} = require("../core/collections");

/**
 * @package tic
 */


/**
 * Parse Jade-like query to an object containing tag, id and classes
 *
 * @param query A string contining jade-like tag, id and classes
 * @param def Default value if empty
 * @returns {Object|{classes: [], tag: string, id: null}}
 *
 * @example
 *  parseQuery('div#root.main.container');
 *  // produces {tag: 'div', id: 'root', classes: ['main', 'container']}
 */
function parseQuery(query, def={}) {
    let params = {
        tag: '',
        id: null,
        classes: []
    };
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