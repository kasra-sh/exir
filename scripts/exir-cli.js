const babel = require("@babel/core");
const generate = require("@babel/generator").default;
const fs = require("fs");
const path = require("path");
const {execFileSync} = require("child_process");
//
// const jsdom = require("jsdom")
const {map} = require("../core/collections");

const parse = require("./cli/xhtmlparser")

let template = `
<template>
  <div id="dashboard-container" class="h-full flex flex-row">
    <vl-map
      ref="map"
      class="w-4/5 flex-grow"
      :controls="map.controls"
      :default-controls="map.controls"
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      :data-projection="'EPSG:4326'">

      <vl-view :enableRotation="false" :center="center" :zoom="zoom" :max-zoom="maxZoom"></vl-view>

      <vl-layer-tile ref="osmLayer" id="osm">
        <vl-source-osm :attributions="attribution"></vl-source-osm>
      </vl-layer-tile>

      <vl-layer-vector ref="featuresLayer" id="features">
        <vl-source-vector :features.sync="deviceList"></vl-source-vector>
        <vl-style-func :factory="getMarkerStyleFactory"></vl-style-func>
      </vl-layer-vector>

      <vl-interaction-select :features.sync="selectedDevices" :layers="['features']">
      {{abc}}
      </vl-interaction-select>
    </vl-map>
  </div>
</template>
<script>
console.log('a');
</script>
`
let parsed = parse(template);

const compiler = require('vue-template-compiler')
let compiled = compiler.compile(template);
console.log(JSON.stringify(parsed, null, 3))

fs.writeFileSync('tmp.js', compiled.render)

const parser = require("node-html-parser");
console.log(parser.parse(template))

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