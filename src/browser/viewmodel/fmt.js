const Lex = require("kenpo-js/kenpo").Lexer,
    Tokenizer = Lex.Tokenizer,
    TokenType = Lex.TokenType;

X.tokenizer = new Tokenizer({
    symbols: [],
    literals: [
        {
            begin: "{{",
            end: ["}}"]
        }
    ],
    postScanners: [
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

X.getProp = function (obj, prop) {
    let pts = prop.split(".");
    let res = obj;
    for (let i=0; i<pts.length; i++) {
        if (res.hasOwnProperty(pts[i]))
            res = res[pts[i]];
        else{
            res = undefined;
            break;
        }
    }
    return res;
};

X.hasProp = function (obj, prop) {
    let pts = prop.split(".");
    let res = obj;
    for (let i=0; i<pts.length; i++) {
        if (!X.isVal(res) || !res.hasOwnProperty(pts[i])) {
            return false;
        }
        res = res[pts[i]];
    }
    return true;
};

X.compileFmt = function (val) {
    if (val.trim() === "") {
        return {
            props: [],
            parts: [val]
        };
    }
    X.tokenizer.reset(val);
    let parts = [];
    let t;
    let props = [];
    while ((t = X.tokenizer.getToken(false)).type !== TokenType.EOF) {
        if (t.type === TokenType.WORD)
            parts.push({
                text: t.text
            })
        else {
            let tc = t.getContent();
            props.push(parts.length);
            parts.push({
                prop: tc
            })
        }
    }
    return {
        props: props,
        parts: parts
    };
};

X.renderFmt = function (temp, data) {
    let render = "";
    for (let i=0; i<temp.length; i++) {
        if (temp[i].prop) {
            render+=X.getProp(data, temp[i].prop.trim()) || "";
        } else {
            render+=temp[i].text;
        }
    }
    return render
};