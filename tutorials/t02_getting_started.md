Please first read installation part if you haven't yet.
eXir can be imported as separate [modules](#modules) or a single monolithic [bundle](#bundle).

#### Modules
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

#### Bundle
Include any bundle you prefer in a script tag and it will become available as two global namespaces.<br>Core, Http and DOM functions are all under `X` global variable.  
View-Model rendering classes and functions are under `VM` global variable.

For example to send a request and transform response data:
```html
<head>
<!--  Bundle with extensions  -->
  <script src="exir-bundle-ext.js"></script>
<!--  ...  -->
</head>
<!--  ...  -->
<script>
var rs = await X.sendGet({
      url:'https://httpbin.org/get',
      params: {count:1},
      headers: {'X-Custom-Header': 'some value'}
    }).then((ajax)=>ajax.Rs.json);

console.log(X.filter(rs, ['headers', 'args']));
// the above using $filter extension
console.log(rs.$filter(['headers', 'args']));
</script>
```