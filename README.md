<p align="center">
<img width="300px" style="max-width: 70%" src="https://raw.githubusercontent.com/kasra-sh/xeer-js/master/.github/logo.png">
</p>
<br>
<p align="center">
<a href="https://npmjs.org/xeer-js"><img src="https://img.shields.io/npm/v/xeer-js" alt="npm"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-informational.svg" alt="License: MIT" /></a>
<img src="https://img.shields.io/badge/Gzipped-15Kb-green" alt="Gzipped Size" />
<img src="https://img.shields.io/badge/Compatibility-ES5/ES6-informational" alt="Compatibility ES5" />
<br>
<h1 align="center">XEER Framework</h1>
</p>

An experimental javascript framework aiming to be a complete prototyping framework (at least).<br>

XEER framework contains :
- **Stream Processing** ~~( lodash )~~
- **DOM Manipulation** ~~( jQuery )~~
- **Async REST Client** ~~( Axios )~~
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
$ npm i xeer-js
```
#### From Source
Clone the repository and install dependencies using your prefered package manager
```sh
$ git clone https://github.com/kasra-sh/xeer-js.git
$ cd xeer-js
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
$ npm i xeer-js
```

#### Bundled
Clone the repository and install dependencies using your prefered package manager
```sh
$ git clone https://github.com/kasra-sh/xeer-js.git
$ cd xeer-js
$ npm install
$ npm bundle
```
bundled files are generated in `dist` directory. `xeer-bundle-es5.js` supports IE9+ and `xeer-bundle.js` is for modern browsers supporting async/await syntax.

## Extensions
Extensions are helper methods appended to prototypes which help make the code cleaner.<br>
For example `X.addClass($('div'), 'container')` will become `$('div').$addClass('container')`.<br>
Extension method names all have `$` prepended to their names to prevent method overrides or duplication.

#### How to use
- If using a bundled version, extensions are enabled by default.
  ```html
  <!-- Modern !-->
      <script src="xeer-bundle.js"></script>
  <!-- Legacy !-->
      <script src="xeer-bundle-es5.js"></script>
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
  require("xeer-js/ext"); 

  // Stream processing extensions
  require("xeer-js/stream.ext");  
  
  // DOM extensions
  require("xeer-js/dom.ext");
  ```


## TODO
> - ViewModel Rendering
> - Documentation