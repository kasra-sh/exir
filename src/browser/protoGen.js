require("./base");

let pros = "";

if (!String.prototype.contains) {
    String.prototype.contains = function (c) {
        return this.indexOf(c)>-1
    }
}

if (!Array.prototype.contains) {
    Array.prototype.contains = function (c) {
        return this.indexOf(c)>-1
    }
}

const elProtos = [HTMLElement, Element, Node]
const listProtos= [HTMLCollection, NodeList, Array];

pros += X._genProto("Q", function (qe) {
    return X.Q(qe, this);
}, elProtos);

pros += X._genProto("Q1", function (qe) {
    return X.Q1(qe, this);
}, elProtos);

pros += X._genProto("Q", function (q) {
    return X.Q(q, this);
}, elProtos);

pros += X._genProto("Q1", function (q) {
    return X.Q1(q, this);
}, elProtos);

// query one on list
pros += X._genProto("Q1", function (q) {
    for (let i=0;i<this.length; i++) {
        let r = this.item(i).Q1(q);
        if (r) return r;
    }
}, listProtos);

// query all on list
pros += X._genProto("Q", function (q) {
    let r = [];
    for (let i=0;i<this.length; i++) {
        r = r.concat(Array.from(this.item(i).Q(q)));
    }
    return r;
}, listProtos);

pros += X._genProto("cls", function () { return X.cls(this); }, elProtos);
pros += X._genProto("attrs", function () { return X.attrs(this); }, elProtos);
pros += X._genProto("styles", function () { return X.styles(this); }, elProtos);

pros += X._genProto("attr", function (a,v) { return X.attr(this,a,v);}, elProtos);
pros += X._genProto("css", function (s,v) { return X.css(this,s,v);}, elProtos);

pros += X._genProto("attr", function (a,v) {
    if (!X.isVal(a)) {
        return X.error("(key) not provided for list attribute modifier!",`\t[].attr(name:${a}, value:${v})`);
    }
    X.ForEach(this, (i)=>{ i.attr(a,v) });
}, listProtos);
pros += X._genProto("css", function (a,v) {
    if (!X.isVal(a)) {
        return X.error("(style) not provided for list style modifier!",`\t[].css(style:${a}, value:${v})`);
    }
    X.ForEach(this, (i)=>{ i.css(a,v) });
}, listProtos);

module.exports = eval(`
        ${pros};
        module.exports={};
    `);