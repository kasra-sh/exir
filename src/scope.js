module.exports = (function () {
    if (global.X) return global.X;

    let X = global.X = {$WIN:{}, $DOC: {}, $HEAD:{}, $BODY: {}};

    if (window) {
        window.X = global.X;
        X.$WIN = window;
        X.$DOC = document;
        window.addEventListener("load", function () {
            X.$BODY = document.body;
            X.$HEAD = document.head;
        });
    }

    X._defGlobal = function (name, func) {
        global[name] = func;
        return func;
    }

    X._defProto = function (name, func, protos) {
        let code = "";
        for (let p of protos) {
            code+= `${p}.${name} = `;
        }
        code += func.toString();

        for (let proto of protos) {
            proto[name] = func;
        }
        return code;
    }

    X._genProto = function (name, func, protos) {
        let code = "";
        for (let p of protos) {
            code += `${p.name}.prototype.${name} = `;
        }
        code += func.toString() + ";\n";
        return code;
    };

    return global.X;
}());