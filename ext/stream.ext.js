const I = require("../core/stream");
const T = require("../core/types");
const L = require("../core/logging");

Array.prototype.$contains = Object.prototype.$contains = String.prototype.$contains = HTMLCollection.prototype.$contains = NodeList.prototype.$contains = function $contains(x) {
    return this.$any(x);
};

Array.prototype.$in = Object.prototype.$in = String.prototype.$in = HTMLCollection.prototype.$in = NodeList.prototype.$in = function $in(x) {
    return x.$any(this)
};

Array.prototype.$startsWith = Object.prototype.$startsWith = String.prototype.$startsWith = HTMLCollection.prototype.$startsWith = NodeList.prototype.$startsWith = function $startsWith(x) {
    return I.StartsWith(this, x)
};

Array.prototype.$each = Object.prototype.$each = String.prototype.$each = HTMLCollection.prototype.$each = NodeList.prototype.$each = function $each(func) {
    return I.ForEach(this, func);
};

Array.prototype.$forEach = Object.prototype.$forEach = String.prototype.$forEach = HTMLCollection.prototype.$forEach = NodeList.prototype.$forEach = function $forEach(func) {
    return I.ForEach(this, func);
};

Array.prototype.$loopArray = Object.prototype.$loopArray = String.prototype.$loopArray = HTMLCollection.prototype.$loopArray = NodeList.prototype.$loopArray = function $loopArray(func) {
    return I.ArrayForEach(this, func);
};

if (Array.prototype.$first === undefined) Array.prototype.$first = function $first(func) {
    return I.First(this, func);
};
if (Object.prototype.$first === undefined) Object.prototype.$first = function $first(func) {
    return I.First(this, func);
};
if (String.prototype.$first === undefined) String.prototype.$first = function $first(func) {
    return I.First(this, func);
};
if (HTMLCollection.prototype.$first === undefined) HTMLCollection.prototype.$first = function $first(func) {
    return I.First(this, func);
};
if (NodeList.prototype.$first === undefined) NodeList.prototype.$first = function $first(func) {
    return I.First(this, func);
};

if (Array.prototype.$last === undefined) Array.prototype.$last = function $last(func) {
    return I.Last(this, func);
};
if (Object.prototype.$last === undefined) Object.prototype.$last = function $last(func) {
    return I.Last(this, func);
};
if (String.prototype.$last === undefined) String.prototype.$last = function $last(func) {
    return I.Last(this, func);
};
if (HTMLCollection.prototype.$last === undefined) HTMLCollection.prototype.$last = function $last(func) {
    return I.Last(this, func);
};
if (NodeList.prototype.$last === undefined) NodeList.prototype.$last = function $last(func) {
    return I.Last(this, func);
};

Array.prototype.$any = Object.prototype.$any = String.prototype.$any = HTMLCollection.prototype.$any = NodeList.prototype.$any = function $any(func) {
    return I.Any(this, func);
};

Array.prototype.$all = Object.prototype.$all = String.prototype.$all = HTMLCollection.prototype.$all = NodeList.prototype.$all = function $all(func) {
    return I.All(this, func);
};

Array.prototype.$filter = Object.prototype.$filter = String.prototype.$filter = HTMLCollection.prototype.$filter = NodeList.prototype.$filter = function $filter(f) {
    return I.Filter(this, f);
};

Array.prototype.$filterRight = Object.prototype.$filterRight = String.prototype.$filterRight = HTMLCollection.prototype.$filterRight = NodeList.prototype.$filterRight = function $filterRight(f) {
    return I.FilterRight(this, f);
};

if (Array.prototype.$map === undefined) Array.prototype.$map = function $map(f) {
    return I.Map(this, f);
};
if (Object.prototype.$map === undefined) Object.prototype.$map = function $map(f) {
    return I.Map(this, f);
};
if (String.prototype.$map === undefined) String.prototype.$map = function $map(f) {
    return I.Map(this, f);
};
if (HTMLCollection.prototype.$map === undefined) HTMLCollection.prototype.$map = function $map(f) {
    return I.Map(this, f);
};
if (NodeList.prototype.$map === undefined) NodeList.prototype.$map = function $map(f) {
    return I.Map(this, f);
};

if (Array.prototype.$flatMap === undefined) Array.prototype.$flatMap = function $flatMap(f) {
    return I.FlatMap(this, f);
};
if (Object.prototype.$flatMap === undefined) Object.prototype.$flatMap = function $flatMap(f) {
    return I.FlatMap(this, f);
};
if (String.prototype.$flatMap === undefined) String.prototype.$flatMap = function $flatMap(f) {
    return I.FlatMap(this, f);
};
if (HTMLCollection.prototype.$flatMap === undefined) HTMLCollection.prototype.$flatMap = function $flatMap(f) {
    return I.FlatMap(this, f);
};
if (NodeList.prototype.$flatMap === undefined) NodeList.prototype.$flatMap = function $flatMap(f) {
    return I.FlatMap(this, f);
};

Array.prototype.$minIndex = Object.prototype.$minIndex = String.prototype.$minIndex = HTMLCollection.prototype.$minIndex = NodeList.prototype.$minIndex = function $minIndex(f) {
    return I.MinIndex(this, f);
};

Array.prototype.$min = Object.prototype.$min = String.prototype.$min = HTMLCollection.prototype.$min = NodeList.prototype.$min = function $min(f) {
    return I.Min(this, f);
};

Array.prototype.$maxIndex = Object.prototype.$maxIndex = String.prototype.$maxIndex = HTMLCollection.prototype.$maxIndex = NodeList.prototype.$maxIndex = function $maxIndex(f) {
    return I.MaxIndex(this, f);
};

Array.prototype.$max = Object.prototype.$max = String.prototype.$max = HTMLCollection.prototype.$max = NodeList.prototype.$max = function $max(f) {
    return I.Max(this, f);
};

Array.prototype.$firstIndex = Object.prototype.$firstIndex = String.prototype.$firstIndex = HTMLCollection.prototype.$firstIndex = NodeList.prototype.$firstIndex = function $firstIndex(f) {
    return I.FirstIndex(this, f);
};

Array.prototype.$lastIndex = Object.prototype.$lastIndex = String.prototype.$lastIndex = HTMLCollection.prototype.$lastIndex = NodeList.prototype.$lastIndex = function $lastIndex(f) {
    return I.LastIndex(this, f);
};


Array.prototype.$toEnum = Object.prototype.$toEnum = function $toEnum() {
    return T.Enum(this);
};
