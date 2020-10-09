const {Core} = require("../dist/node");
console.log('ALL', Core.filter(Core,(v,k)=>k.startsWith('f')))
const fs = require("fs")
const pj = require("@babel/core");
process.argv.slice(2).forEach((file)=>{
    let code = pj.transform(fs.readFileSync("vm/App.jsx"), {
        presets: [["@babel/preset-react",{
            "pragma": "VNode.create", // default pragma is React.createElement (only in classic runtime)
            "pragmaFrag": "'FRAG'", // default is React.Fragment (only in classic runtime)
            "throwIfNamespace": false, // defaults to true
            "runtime": "classic" // defaults to classic
            // "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
        }]],
    }).code;
    fs.writeFileSync("vm/index.js", code);
})
