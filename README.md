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
<h1 align="center">eXir Framework</h1>
</p>

An experimental javascript framework aiming to be a complete prototyping framework .<br>

eXir framework contains :
- **Core Utils**
  - Extended Collection utilities: chunk, omit, join, etc.
  - Function helpers: throttle, debounce, etc.
  - String analyzers and transformers.
  - Concise Type Checking: isNull, isObj, etc.
- **DOM Utils**
  - Flexible, Fool-Proof element/class/attribute/style CRUD
  - Painless, Predicable Event Handling
  - Optional native method wrappers for addEventListener, etc. for debugging or other purposes
- **HTTP Client**
  - Supports Promises and async/await
  - Rate Limitting
  - Request cancellation
  - 
- **VirtualDOM**
- **Dynamic ViewModel Components** ~~( React, Vue, Mithril, ... )~~

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
$ pnpm bundle
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
$ cd exir
$ npm install
$ npm bundle
```
bundled files are generated in `dist` directory. `exir-bundle-es5.js` supports IE9+ and `exir-bundle.js` is for modern browsers supporting async/await syntax.

## Extensions
Extensions are helper methods appended to prototypes which help make the code cleaner.<br>
For example `X.addClass($('div'), 'container')` will become `$('div').$addClass('container')`.<br>
Extension method names all have `$` prepended to their names to prevent method overrides or duplication.

#### How to use
- If using a bundled version, extensions are enabled by default.
  ```html
  <!-- Modern !-->
      <script src="exir-bundle.js"></script>
  <!-- Legacy !-->
      <script src="exir-bundle-es5.js"></script>
      <script>
        var obj = {
            ABC: "text1",
            ACD: "text2",
            BAR: 1
        }
        console.log(obj.$filter((v,k)=>k.$startsWith('A')));
        // Outputs object { ABC: "text1", ACD: "text2" }
      </script>
  <!-- ... !-->
  ```
- If using as module in a node project:
  ```javascript
  // All extensions
  require("exir/ext"); 

  // Stream processing extensions
  require("exir/colelctions.ext");  
  
  // DOM extensions
  require("exir/dom.ext");
  ```


## TODO
> - ViewModel Rendering
> - Documentation
