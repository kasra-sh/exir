<p align="center">
<img width="200px" style="max-width: 70%" src="https://raw.githubusercontent.com/kasra-sh/exir/master/.github/logo.png">
</p>
<br>
<p align="center">
<a href="https://npmjs.org/exir"><img src="https://img.shields.io/npm/v/exir" alt="npm"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-informational.svg" alt="License: MIT" /></a>
<img src="https://img.shields.io/badge/Gzipped-15Kb-green" alt="Gzipped Size" />
<img src="https://img.shields.io/badge/Compatibility-Mixed-informational" alt="Compatibility ES5" />
<img src="https://img.shields.io/badge/node->=8-yellow" alt="Node Version >= 8" />
<br>
<h1 align="center"><b>eXir Javascript Library</b></h1>
</p>

- [What is eXir?](#what-is-exir)
- [Why eXir?](#why-exir)
- [Installation](#installation)
  - [Package Manager](#package-manager)
  - [From Source](#from-source)
- [Getting Started](#getting-started)
- [Documentation & Tutorials](https://kasra-sh.github.io/exir-docs)
- [Examples](https://github.com/kasra-sh/exir/tree/master/examples/)

## **What is eXir?**
Persian word اکسیر, pronounced *ex'ear* is a mythical potion which transmutes things to a substance of higher value (iron to gold) or cures all illness.<br>
**eXir** is a lightweight javascript library (which is not just a sentence!), and it is supposed to cure dependency *infection*!<br>

What's included :
- **Core Utils**
  - Extended Collection utilities: chunk, omit, join, etc.
  - Function helpers: throttle, debounce, etc.
  - String analyzers and transformers.
  - Concise Type Checking: isNull, isObj, etc.
- **DOM Utils**
Basic DOM manipulation utility functions.
  - Flexible, Fool-Proof element/class/attribute/style CRUD
  - Painless, Predicable Event Handling
  - Optional native method wrappers for addEventListener, etc. for debugging or other purposes
- **HTTP Client/Methods**
  [Examples](https://github.com/kasra-sh/exir/tree/master/examples/)
<br> An elegant wrapper around XHR to satisfy your every request!
  - Convenient Http Methods Get, Post, ...
  - Supports Promises, async/await
  - Timeout and retry
  - Rate Limiting
  - Request cancellation
- **Web Components**
  [Examples](https://github.com/kasra-sh/exir/tree/master/examples/)
<br> Reusable/Dynamic pure js components (css-in-js included).
  - Dynamically Rendered Components (virtual dom)
  - Reactive State Management *(beta)*
  - Routing *(coming soon)*
  
*All* of the above in a bundle of *less than* 15Kb gzipped, which could be the size of a whole web app using only what's necessary (tree-shaking).

## **Why eXir?**
Many libraries/frameworks exist which claim to be fast/lightweight, are in fact what they claim to be in early releases or first stages of development,
but many start to get bigger and more complicated as they try their hardest to make everything more convenient or add some extra features.
Why make it so abstract and complicated in the first place and then make some more advanced tools to simplify it?
Many web developers are dealing with the constant struggle of making frequent changes and optimization, not because some 16core workstation cannot handle extra lines of javascript,
but for the sake of those not nearly as powerful/optimized mobile browsers (Android, RPi, etc.), the very same devices which are first-class targets for PWAs.

---

## **Installation**
### Package Manager
With your prefered package manager run :
```shell script
$ npm i exir
```
```shell script
$ yarn add exir
```
### From Source
Clone the repository and install dependencies using your preferred package manager
```sh
$ git clone https://github.com/kasra-sh/exir.git
$ cd exir
$ npm install
```
To regenerate extensions and bundles, make sure you have [Parcel](https://parceljs.org) installed globally:
```sh
$ npm run bundle
```
---

## **Getting Started**

### Bundles
Include a monolithic bundle file directly in your html file, bundle files having "*-ext" suffix include extensions.
```html
<!-- Modern !-->
  <script src="exir-bundle-ext.js"></script>
<!-- Legacy !-->
  <script src="exir-bundle-legacy-ext.js"></script>
  <script>
    var obj = {
        ABC: "text1",
        ACD: "text2",
        BAR: 1,
        Obj1: { name: "jack" , id: 1},
        Obj2: { name: "karen", id: 2},
        Obj3: { name: "jack" , id: 3},
        Obj3: { name: "karen", id: 4},
    }
    console.log(obj.$filter((v,k)=>k.$startsWith('A')));
    // Outputs object { ABC: "text1", ACD: "text2" }
    
    console.log(obj.$filter(['ABC']));
    // Outputs object { ABC: "text1" }

    console.log(obj.$filter({name: "jack"}));
    // Outputs object { Obj1: { name: "jack", id: 1 }, Obj3: { name: "jack", id: 3 }}

    console.log(obj.$filter({name: X.ANY}));
    // Outputs object {
    //    Obj1: { name: "jack" , id: 1},
    //    Obj2: { name: "karen", id: 2},
    //    Obj3: { name: "jack" , id: 3},
    //    Obj3: { name: "karen", id: 4},
    // }
  </script>
<!-- ... !-->
```
### Modules
CommonJS `require()` example:
```js
// Core
// namespace
const X = require("exir/core");
// functions
const {join} = require("exir/core/collections");
const {debounce} = require("exir/core/functions");

// Dom
// namespace
const Dom = require("exir/dom");
// functions
const {toggleClass} = require("exir/dom/classes");

// Http
// namespace
const Http = require("exir/http");
// http methods
const {sendGet, Post} = require("exir/http/methods");
// http client
const {XHttpClient} = require("exir/http/client");

// View-Model
const {mount, Component, VNode} = require("exir/vm/app");

// All Extensions
require("exir/ext");
// Collection Extensions
require("exir/ext/collections.ext");
// Dom Extensions
require("exir/ext/dom.ext");
```

ECMAScript Modules(ESM) `import` example:
```js
// Core
import {join, flatMap, debounce} from "exir/core/collections"

// Dom
import {css, toggleClass, event} from "exir/dom"

// Http
import {XHttpClient, Get, sendPost} from "exir/http"

// View-Model
import {mount, Component, VNode} from "exir/vm/app"

// All Extensions
import "exir/ext";
// Collection Extensions
import "exir/ext/collections.ext";
// Dom Extensions
import "exir/ext/dom.ext";
```

Also read [Tutorials and Documentation](https://kasra-sh.github.io/exir-docs)


## Disclaimer
This project is under heavy development, some parts may change, break or be removed.<br>
Documentation is not complete *yet*, each part's documentation will be added as soon as it seems stable enough.<br>
Parcel's zero-config has helped a LOT but is not a necessity, it is completely fine to use another bundler/transpiler like Webpack, Rollup or other "magic" tools.
eXir is safe to be used beside other libraries, *although* extensions modify Object prototypes which many deem dangerous, unnecessary or whatever else, use them at your own risk!