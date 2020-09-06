const I = require("./core/iter");
const T = require("./core/types");
const L = require("./core/logging");

Array.prototype.$contains = function $contains(x) {
    return this.indexOf(x) >= 0
};


String.prototype.$contains = function $contains(x) {
    return this.indexOf(x) >= 0
};

String.prototype.$any = function $any(func) {
    return I.Any(this, func);
};


Array.prototype.$each = Object.prototype.$each = function $each(func) {
    return I.ForEach(this, func);
};

Array.prototype.$forEach = Object.prototype.$forEach = function $forEach(func) {
    return I.ForEach(this, func);
};

Array.prototype.$filter = Object.prototype.$filter = function $filter(f) {
    return I.Filter(this, f);
};

Array.prototype.$filterRight = Object.prototype.$filterRight = function $filterRight(f) {
    return I.FilterRTL(this, f);
};

if (Array.prototype.$map === undefined) Array.prototype.$map = function $map(f) {
    return I.Map(this, f);
};
if (Object.prototype.$map === undefined) Object.prototype.$map = function $map(f) {
    return I.Map(this, f);
};

if (Array.prototype.$flatMap === undefined) Array.prototype.$flatMap = function $flatMap(f) {
    return I.FlatMap(this, f);
};
if (Object.prototype.$flatMap === undefined) Object.prototype.$flatMap = function $flatMap(f) {
    return I.FlatMap(this, f);
};

Array.prototype.$toEnum = Object.prototype.$toEnum = function $toEnum() {
    return T.Enum(this);
};


Array.prototype.$loopArray = function $loopArray(func) {
    return I.ArrayForEach(this, func);
};

if (Array.prototype.$first === undefined) Array.prototype.$first = function $first(func) {
    return I.First(this, func);
};

if (Array.prototype.$last === undefined) Array.prototype.$last = function $last(func) {
    return I.Last(this, func);
};

Array.prototype.$any = function $any(func) {
    return I.Any(this, func);
};

Array.prototype.$all = function $all(func) {
    return I.All(this, func);
};

Array.prototype.$forEach = function $forEach(f) {
    return I.ForEach(this, f);
};
