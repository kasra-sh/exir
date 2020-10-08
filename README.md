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
<h1 align="center">eXir Javascript Library</h1>
</p>

### What is eXir?
Persian word اکسیر, pronounced *ex'ear* is a mythical potion which transmutes things to a substance of higher value (iron to gold) or cures all illness.<br>
**eXir** is a lightweight javascript library (which is not just a sentence!), and it is supposed to cure dependency *infection*!<br>

eXir library contains :
- **Core Utils**
An state-of-art approach to the most basic tasks (just some utility functions!)
  - Extended Collection utilities: chunk, omit, join, etc.
  - Function helpers: throttle, debounce, etc.
  - String analyzers and transformers.
  - Concise Type Checking: isNull, isObj, etc.
- **DOM Utils**
The most advanced enterprise DOM altering technology (basic DOM manipulation)
  - Flexible, Fool-Proof element/class/attribute/style CRUD
  - Painless, Predicable Event Handling
  - Optional native method wrappers for addEventListener, etc. for debugging or other purposes
- **HTTP Client/Methods**
An elegant wrapper around XHR to satisfy your every request!
  - Supports Promises, async/await
  - Timeout and retry (real!)
  - Rate Limiting (also real!)
  - Request cancellation (kidding right?)
- **Web Components**
  - Virtual DOM
  - Reactive State Management *(coming soon)*
  - Routing *(coming soon)*

### Why use eXir?
*All* of the above in a bundle of *less than* 15Kb gzipped, which could be the size of a whole web app if using only what's necessary (tree-shaking).
Many libraries/frameworks exist which claim to be fast and lightweight are in fact what they claim to be in early releases or first stages of development,
but many start to get bigger and more complicated as they try their hardest to make everything convenient or add some extra feature that someone requested.
Why make it so abstract and complicated that you feel the need to make more advanced tools to be able to debug it?!
As developers (mainly web developers) there is a constant struggle to make changes quickly and at the same time reduce unnecessary clutter not because your 32xCore bla, bla... cannot handle it,
but for the sake of those not nearly as powerful or optimized mobile(Android, RPi, ...) browsers, and yes talking about the very same devices which PWAs are also targeting.

*Besides* not all webpages are supposed to render dynamically, what about the statically rendered websites? well ... you can always *put a bundle on it*!

---

- [Installation](#installation)
  - [Package Manager](#package-manager)
  - [From Source](#from-source)
- [Usage](#usage)
  - [Node module](#node-module)
  - [Bundled](#bundled)
- [Extensions](#extensions)
  - [How to use](#how-to-use)
- [TODO](#todo)

## Installation
#### Package Manager
Simply use any package manager (npm, yarn, pnpm, ...) to install from [npmjs.org](https://npmjs.org)
```shell script
$ npm i exir
```
#### From Source
Clone the repository and install dependencies using your prefered package manager
```sh
$ git clone https://github.com/kasra-sh/exir.git
$ cd exir
$ npm install
```
To regenerate extensions and bundles, make sure you have [Parcel](https://parceljs.org) installed globaly:
```sh
$ npm run bundle
```
---
## Usage
#### Node module
Use any package manager (npm, yarn, pnpm, ...) to install from [npmjs.org](https://npmjs.org)
```shell script
$ npm i exir
```

#### Bundled
Clone the repository and install dependencies using your prefered package manager
```sh
$ git clone https://github.com/kasra-sh/exir.git
```
Bundles are already included inside *dist* directory, but if you wish to apply your changes to them here's how to do it :
```sh
$ cd exir
$ npm install
$ npm run bundle
```
bundled files will be generated inside `dist` directory. `exir-bundle-legacy.js` supports IE9+ (include package "regenerator/runtime" for async/await), `exir-bundle.js` is for more modern browsers which support ES6/ES7.
 
## Extensions
Extensions are helper methods appended to prototypes which help make the code cleaner.(optional)<br>
For example `X.addClass($('div'), 'container')` will become `$('div').$addClass('container')`.<br>
Extension method names all have `$` prepended to their names to prevent method overrides or duplication.

#### How to use
- bundle files having "*-ext" postfix include everything plus extensions
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
- Using extensions in non-browser environment:
  ```javascript
  // All extensions
  require("exir/ext"); 

  // Stream processing extensions
  require("exir/ext/collections.ext");  
  
  // DOM extensions
  require("exir/ext/dom.ext");
  ```

### Disclaimer
This project is under heavy development, some parts may change, break or be removed.<br>
Documentation is not complete **yet**, each part's documentation will be added as soon as it seems stable enough.<br>
Parcel's zero-config has helped a LOT but is not a necessity, it is completely fine to use another bundler/transpiler like Webpack, Rollup or other "magic" tools.