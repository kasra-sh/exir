const X = require("../scope");

X.isUnd = function (x) {
    return x!==null && x === undefined;
}

X.isNull = function (x) {
    return x === null;
}

X.isVal = function (x) {
    return !X.isUnd(x) && !X.isNull(x);
}

X.isNum = function (x) {
    return typeof x === "number";
}

X.isStr = function (x) {
    return typeof x === "string" || x instanceof String;
}

X.isFun = function (x) {
    return typeof x === "function";
}

X.isObj = function (x) {
    return typeof x === "object";
}

X.isArr = function (x) {
    return x instanceof Array
}

X.isList = function (x) {
    return X.isVal(x.length) && X.isFun(x.item)
}

X.isEl = function (x) {
    return x instanceof Element || x instanceof HTMLElement || x instanceof Node;
}

X.isEls = function (x) {
    return x instanceof HTMLCollection || x instanceof NodeList;
}
X.Enum = function (array, start=0) {
    let c = start;
    let MAP = {};
    for (let i of array) {
        MAP[MAP[c] = i] = c++;
    }
    return MAP;
}
// X._defGlobal("Enum" , function (array, start=0) {
//     let c = start;
//     let MAP = {};
//     for (let i of array) {
//         MAP[MAP[c] = i] = c++;
//     }
//     return MAP;
// });