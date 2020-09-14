const T = require("../core/types");
const L = require("../core/logging");
let X = {};
X.$DOC = global.document || {};
X.$BODY = X.$DOC.body || {};
X.$HEAD = X.$DOC.head || {};

X.$ = function (q, root = document) {
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

X.$$ = function (q, root = document) {
    if (T.isEl(q)) return q;
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

module.exports = X;