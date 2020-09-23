const T = require("../core/types");
const L = require("../core/logging");
const {cls} = require("../dom/classes")

function $(q, root = document) {
    if (T.isEl(q)) return Array.of(q);
    if (T.isEls(q)) return q;
    if (!T.isStr(q)) {
        L.error(`Query is not string nor element X.$(${q})`);
        return null;
    }
    if (!T.isEl(root)) {
        L.error(`Query root is not a node!\t[X.$(${q}, ${root})]`);
        return null;
    }
    return Array.from(root.querySelectorAll(q));
}

function $$(q, root = document) {
    if (T.isEl(q)) return Array.of(q);
    if (!T.isStr(q)) {
        L.error(`Query is not string nor element X.$$(${q})`);
        return null;
    }
    if (!T.isEl(root)) {
        L.error(`Query root is not a node!\t[X.$(${q}, ${root})]`);
        return null;
    }
    return Array.of(root.querySelector(q));
}

function queryOf(e, maxParent, q) {
    if ((!T.isVal(e) || !T.isEl(e))) {
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

        return (queryOf(e.parentElement) + " > " + gen) + (!(q === "") ? ' ' + q : "");
    } else {
        return gen + (!(q === "") ? ' ' + q : "");
    }
}

module.exports = {$, $$, queryOf};