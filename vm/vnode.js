const {parseQuery} = require("../dom/tic");
const {map} = require("../core/collections");
const {isStr, isObj, isFun, isEmpty, isVal} = require("../core/types");

class VNode {
    constructor(tag="#text") {
        this.tag = tag;
        this.id = undefined;
        this.text = undefined;
        this.element = undefined;
        this.attr = {}
    }

    get isText() {
        return this.tag === '#text';
    }

    get $first() {
        return this.nodes[0];
    }

    get $text() {
        if (this.isText) return this.text;
        return (this.$first&&this.$first.isText)?this.$first.text:undefined;
    }

    set $text(v) {
        if (this.isText) {
            this.text = v;
        } else {
            if (this.$text) {
                this.$first.$text = v;
            } else {
                this.text = v;
            }
        }
    }

    static createRef(type, props) {
        let vRef = new VNode(!isVal(type.name) || isEmpty(type.name)?type.constructor.name:type.name);
        vRef.target = type;
        vRef.isRef = true;
        vRef.props = props;
        return vRef;
    }

    static create(type, args={attr:{}, on: {}}, ...children) {
        if (isFun(type) || isObj(type))
            return VNode.createRef(type, args);

        if (children[0] instanceof Array)
            children = children[0]

        children = map(children,(ch)=>isStr(ch)?VNode.createText(ch):ch);
        let query = parseQuery(type);
        let vNode = new VNode(query.tag);
        vNode.id = query.id;
        vNode.attr = args.attr || {};
        if (args.style) vNode.attr.style = args.style
        if (!vNode.attr.class && query.hasClass)
            vNode.attr.class = query.classes.join(' ');

        vNode.nodes = children;
        return vNode;
    }

    static createText(text) {
        let vn = new VNode();
        vn.text = text;
        return vn;
    }
}

module.exports = {VNode}