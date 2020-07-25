require("./base");
require("./types");

let pros = "";

pros += X._genProto("ForEach", function (func) {
    if (!(X.isList(this))) {
        X.warn(`ForEach on possibly non-iterable Object!\t${this}.ForEach(f)`)
    }
    return X.ForEach(this, func);
}, [Array, Object]);

pros += X._genProto("LoopArray", function (func) {
    return X.LoopArray(this, func);
}, [Array, HTMLCollection, NodeList]);

pros += X._genProto("First", function (func) {
    return X.First(this, func);
}, [Array, HTMLCollection, NodeList]);

pros += X._genProto("Any", function (func) {
    return X.Any(this, func);
}, [Array, HTMLCollection, NodeList]);

pros += X._genProto("All", function (func) {
    return X.All(this, func);
}, [Array, HTMLCollection, NodeList]);

pros += X._genProto("Filter", function (f) {
    return X.Filter(this, f);
}, [Array, Object]);

pros += X._genProto("Map", function (f) {
    return X.Map(this, f);
}, [Array, Object]);

pros += X._genProto("FlatMap", function (f) {
    return X.FlatMap(this, f);
}, [Array, Object]);

pros += X._genProto("asEnum", function () {
    return X.Enum(this);
}, [Array]);

module.exports = eval(`
        ${pros};
        module.exports={};
    `);