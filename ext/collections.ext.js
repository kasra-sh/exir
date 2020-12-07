const I = require("../core/collections");
const T = require("../core/types");
const L = require("../core/logging");

function $contains(x) {
    return this.$any(x);
};

function $in(x) {
    return x.$any(this)
};

function $startsWith(x) {
    return I.startsWith(this, x)
};

function $each(func) {
    return I.forEach(this, func);
};

function $forEach(func) {
    return I.forEach(this, func);
};



function $any(func) {
    return I.any(this, func);
};

function $all(func) {
    return I.all(this, func);
};

function $filter(f) {
    return I.filter(this, f);
};

function $filterRight(f) {
    return I.filterRight(this, f);
};



function $minIndex(f) {
    return I.minIndex(this, f);
};

function $min(f) {
    return I.min(this, f);
};

function $maxIndex(f) {
    return I.maxIndex(this, f);
};

function $max(f) {
    return I.max(this, f);
};

function $firstIndex(f) {
    return I.firstIndex(this, f);
};

function $lastIndex(f) {
    return I.lastIndex(this, f);
};


function $toEnum() {
    return T.Enum(this);
};
