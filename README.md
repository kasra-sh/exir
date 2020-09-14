# XEER JS

[![npm](https://img.shields.io/npm/v/xeer-js)](https://npmjs.org/xeer-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-informational.svg)](https://opensource.org/licenses/MIT)
![Gzipped Size](https://img.shields.io/badge/Gzipped-15Kb-green)
![Compatibility ES5](https://img.shields.io/badge/Compatibility-ES5-informational)

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
```
## Extensions
Extensions are helper methods appended to prototypes which help make the code cleaner.<br>
For example `X.addClass($('div'), 'container')` will become `$('div').$addClass('container')`.<br>
Extension method names all have `$` prepended to their names to prevent method overrides or duplication.
#### How to use
- If using bundled `xeer-bundle.js`, extensions are enabled by default.
  ```html
  <!-- ... !-->
      <script src="xeer-bundle.js"></script>
      <script>
        console.log(.$filter((v,k,i)=>k.$startsWith('A')));
        // array of all fields/properties of window object which names' start with 'A'  
      </script>
  <!-- ... !-->
  ```
- If using as module in a node project:
  ```javascript
  // All extensions
  require("xeer-js/ext"); 

  // Stream processing extensions
  require("xeer-js/iter.ext");  
  
  // DOM extensions
  require("xeer-js/ui.ext");
  ```


## TODO
> - ViewModel Rendering
> - Documentation
> - Better code generation