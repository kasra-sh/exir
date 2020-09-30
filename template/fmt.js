const T = require("../core/types")
const I = require("../core/collections");
const Lex = require("kenpo-js/src/lexer/Tokenizer"),
    Tokenizer = Lex.Tokenizer,
    TokenType = Lex.TokenType;

let fmt = {};
fmt.stringValue = function (pv) {
    if (T.isObj(pv)) {
        return JSON.stringify(pv)
    }
    return pv;
}
fmt.tokenizer = new Tokenizer({
    symbols: [],
    literals: [
        {
            begin: "{{",
            end: ["}}"],
            multiline: false
        }
    ],
    preScanners: [
        {
            scan: function (reader) {
                let f = false;
                while (reader.avail()) {
                    if (reader.readNext() === "{") {
                        reader.pushBack(1);
                        break
                    } else {
                        f = true;
                    }
                }
                return f ? TokenType.WORD : false
            },
            result: function (reader) {
                return {
                    index: reader.mrk,
                    type: TokenType.WORD,
                    text: reader.getCurrentString()
                }
            }
        }
    ]
});

fmt.getProp = function (obj, prop) {
    let pts = prop.split(".");
    let res = obj;
    for (let i=0; i<pts.length; i++) {
        if (res.hasOwnProperty(pts[i])){
            res = res[pts[i]];
        }
        else{
            res = undefined;
            break;
        }
    }
    return res
};

fmt.hasProp = function (obj, prop) {
    let pts = prop.split(".");
    let res = obj;
    for (let i=0; i<pts.length; i++) {
        if (!fmt.isVal(res) || !res.hasOwnProperty(pts[i])) {
            return false;
        }
        res = res[pts[i]];
    }
    return true;
};

fmt.compile = function (val) {
    if (val.trim() === "") {
        return {
            props: [],
            parts: [val]
        };
    }
    fmt.tokenizer.reset(val);
    let parts = [];
    let t;
    let props = [];
    while ((t = fmt.tokenizer.getToken(true)).type !== TokenType.EOF) {
        if (t.type === TokenType.LITERAL) {
            let tc = t.getContent();
            props.push(parts.length);
            parts.push({
                prop: tc
            })
        }
        else {
            parts.push({
                text: t.text
            })
        }
    }
    return {
        props: props,
        parts: parts
    };
};

fmt.render = function (temp, data) {
    let render = "";
    for (let i=0; i<temp.parts.length; i++) {
        if (temp.parts[i].prop) {
            render+= fmt.stringValue(fmt.getProp(data, temp.parts[i].prop.trim())) || "";
        } else {
            render+=temp.parts[i].text;
        }
    }
    return render
};
//
// Fmt.render = function (template, properties) {
//     return Fmt.renderTemplate(Fmt.compile(template), properties)
// }

module.exports = {Fmt: fmt}