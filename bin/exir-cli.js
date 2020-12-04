const babel = require("@babel/core");
const generate = require("@babel/generator").default;
const fs = require("fs");
const path = require("path")
const {execFileSync} = require("child_process")

const config = {
    "plugins": ["@babel/plugin-proposal-class-properties"],
    "presets": [["@babel/preset-react", {
        "pragma": "jsx",
        "pragmaFrag": "'FRAGMENT'",
        "throwIfNamespace": false,
        "runtime": "classic"
    }]]
}

if (process.argv[2] === 'compileJSX') {
    const filePath = path.resolve(process.cwd(), process.argv[3])
    const content = fs.readFileSync(filePath, "utf8");
    const parse = babel.parse(content, config)
    // parse.program.body = parse.program.body.filter((n)=>n.type!=="ImportDeclaration")
    let exp = parse.program.body.find((n)=>n.type === "ExportDefaultDeclaration").declaration
    parse.program.body = [exp]
    const genCode = babel.transform(generate(parse, config).code, config).code
    const fname = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + '.js')
    fs.writeFileSync(fname, genCode)
}

if (process.argv[2] === 'parcel') {
    const args = process.argv.slice(3);
    execFileSync("../node_modules/.bin/parcel")
}