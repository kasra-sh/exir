// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"aca60b261c3e8b39c0d970803513c352":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "277a2f5e98b1889e249aee178a592f9f";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets; // eslint-disable-next-line no-redeclare

var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
  var port = HMR_PORT || location.port;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(global.parcelRequire, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var absolute = /^https?:\/\//i.test(links[i].getAttribute('href'));

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(global.parcelRequire, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"eb397b394ebff17b5f4b9224cf897db4":[function(require,module,exports) {
const scope = require("./core/scope");

const core = require('./core');

const dom = require('./dom');

const http = require('./http');

module.exports = {
  X: scope.mergeAll(core, dom, http)
};
},{"./core/scope":"3e818b6d40d5f6d7b4a0b511d3073538","./core":"0c3b39b8a066c1cb33e80da8cd27c77e","./dom":"244ef49a3ac277ccaa8adb2d808e6f8e","./http":"59b1590a42565cf7e06639724c685dde"}],"3e818b6d40d5f6d7b4a0b511d3073538":[function(require,module,exports) {
var global = arguments[3];

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Log = require("./logging");

function merge(src, target) {
  for (let k of Object.keys(src)) {
    if (!src[k] instanceof Array && typeof src[k] === "object") {
      if (!target.hasOwnProperty(k)) target[k] = {};
      merge(src[k], target[k]);
    } else target[k] = src[k];
  }

  return target;
}

function mergeAll(...obj) {
  let res = {};

  for (let k of Object.keys(obj)) {
    merge(obj[k], res);
  }

  return res;
}

function setGlobal(obj) {
  merge(obj, global);
}

class Extension {
  constructor(types) {
    _defineProperty(this, "types", []);

    _defineProperty(this, "pcode", "\n");

    this.types = types;
  }
  /**
   *
   * @param namedFunc {Function}
   * @return {string}
   */


  define(namedFunc) {
    if (!namedFunc.name) {
      let err = `Function must have a name [Extension.define(f)]\n<<${namedFunc}>>`;
      Log.error(err);
      return `\n/**\n *${err}\n */`;
    }

    let code = "\n";

    for (let p of this.types) {
      if (p !== undefined) code += `${p.name || p}.prototype.${namedFunc.name} = `;
    }

    code += namedFunc.toString() + ";\n";
    this.pcode += code;
    return code;
  }

  polyfill(namedFunc) {
    if (!namedFunc.name) {
      let err = `Extension function must have a name:\n<<${namedFunc}>>`;
      Log.error(err);
      return `\n/**\n *${err}\n */`;
    }

    let code = "\n";

    for (let p of this.types) {
      code += `if (${p.name || p}.prototype.${namedFunc.name} === undefined) ${p.name || p}.prototype.${namedFunc.name} = ${namedFunc.toString()};\n`;
    }

    this.pcode += code;
  }

}

function isBrowser() {
  return global.window !== undefined && global.document !== undefined && global.navigator !== undefined;
}

if (!isBrowser()) {
  // -------------
  global.HTMLElement = !global.HTMLElement ? function HTMLElement() {} : global.HTMLElement;
  global.Element = !global.Element ? function Element() {} : global.Element;
  global.Node = !global.Node ? function Node() {} : global.Node;
  global.HTMLCollection = !global.HTMLCollection ? function HTMLCollection() {} : global.HTMLCollection;
  global.NodeList = !global.NodeList ? function NodeList() {} : global.NodeList; // -------------
}

module.exports = {
  merge,
  mergeAll,
  setGlobal,
  Proto: Extension,
  isBrowser
};
},{"./logging":"a02fa9eb1b6522eefcfa0521c70b6377"}],"a02fa9eb1b6522eefcfa0521c70b6377":[function(require,module,exports) {
const T = require("./types");

let X = {};

function __logtime__() {
  let t = new Date();
  return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}:${t.getMilliseconds()}`;
}

function logTitle(flag) {
  return `[${flag}] [${__logtime__()}]`;
}

function prepareLog(args, lt) {
  args.reverse();
  args.push("display: inline-block; font-weight: bold; color: black", "%c" + lt);
  args.reverse();
}

X.Level = T.Enum({
  TRACE: 0,
  INFO: 0,
  WARN: 0,
  ERROR: 0,
  SILENT: 0
});
X.LogLevel = X.Level.TRACE;

X.showTrace = function () {
  X.LogLevel = X.Level.TRACE;
};

X.showInfo = function () {
  X.LogLevel = X.Level.INFO;
};

X.showWarn = function () {
  X.LogLevel = X.Level.WARN;
};

X.showError = function () {
  X.LogLevel = X.Level.ERROR;
};

X.silent = function () {
  X.LogLevel = X.Level.SILENT;
};

function lvl(l) {
  return X.LogLevel !== X.Level.SILENT && X.LogLevel <= l;
}

X.trace = function (...args) {
  if (!lvl(X.Level.TRACE)) return;
  args.reverse();
  args.push(logTitle("X-TRACE"));
  args.reverse(); // args.push("\n");

  console.trace.apply(X, args);
};

X.info = function (...args) {
  if (!lvl(X.Level.INFO)) return;
  prepareLog(args, logTitle("X-INFO"));
  console.log.apply(X, args);
};

X.warn = function (...args) {
  if (!lvl(X.Level.WARN)) return;
  prepareLog(args, logTitle("X-WARN"));
  console.warn.apply(X, args);
};

X.error = function (...args) {
  if (!lvl(X.Level.ERROR)) return;
  prepareLog(args, logTitle("X-ERROR"));
  console.error.apply(X, args);
};

module.exports = X;
},{"./types":"1a7bbe246f4e41357a43a1f53acd056d"}],"1a7bbe246f4e41357a43a1f53acd056d":[function(require,module,exports) {
var _temp;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let T = {};

T.isUnd = function (x) {
  return x !== null && x === undefined;
};

T.isNull = function (x) {
  return x === null;
};

T.isVal = function (x) {
  return !T.isUnd(x) && !T.isNull(x);
};

T.isNum = function (x) {
  return typeof x === "number";
};

T.isStr = function (x) {
  return typeof x === "string" || x instanceof String;
};

T.isFun = function (x) {
  return typeof x === "function";
};

T.isObj = function (x) {
  return typeof x === "object";
};

T.isArr = function (x) {
  return x instanceof Array;
};

T.isPrim = function (x) {
  return T.isVal(x) && !T.isObj(x) && !T.isFun(x);
};

T.isList = function (x) {
  return T.isVal(x.length) && T.isFun(x.item);
};

T.isMutableList = function (x) {
  return T.isVal(x.length) && T.isFun(x.item) && T.isFun(x.add);
};

T.isEl = function (x) {
  return x instanceof Element || x instanceof HTMLElement || x instanceof Node;
};

T.isEls = function (x) {
  return x instanceof HTMLCollection || x instanceof NodeList;
};

T.hasField = function hasField(obj, field, pred) {
  if (!T.isVal(obj)) return undefined;

  if (T.isFun(pred)) {
    return pred(obj[field]);
  }

  return obj.hasOwnProperty(field);
};

T.isEmpty = function (x) {
  if (T.hasField(x, 'length')) return x.length <= 0;
  if (T.isFun(x)) return false;
  if (T.isObj(x)) return Object.keys(x).length <= 0;
  return true;
};
/**
 *
 * @param src {Object | String[]}
 * @return {(array)}
 * @constructor
 */


T.Enum = function (src) {
  let c = 0;
  let MAP = {};

  for (let i of Object.keys(src)) {
    MAP[MAP[c] = i] = c++;
  }

  return MAP;
};

T.Set = (_temp = class {
  constructor(items) {
    _defineProperty(this, "items", []);

    this.items = items;
  }

  static of(src) {
    return new T.Set(src);
  }

  add(item) {
    if (this.items.indexOf(item) < 0) {
      this.items.push(item);
    }
  }

  contains(item) {
    return this.items.indexOf(item) >= 0;
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

}, _temp);

T.dict = function (...args) {
  let o = {};

  for (let i = 0; i < args.length; i++) {
    if (i % 2 !== 0) continue;
    o[args[i]] = args[i + 1];
  }

  return o;
};

module.exports = T;
},{}],"0c3b39b8a066c1cb33e80da8cd27c77e":[function(require,module,exports) {
const scope = require('./scope');

module.exports = scope.mergeAll(require('./stream'), require('./logging'), require('./types'), require('./cases'), require('./strings'));
},{"./scope":"3e818b6d40d5f6d7b4a0b511d3073538","./stream":"a3faed8e762a679a045dedb115d77756","./logging":"a02fa9eb1b6522eefcfa0521c70b6377","./types":"1a7bbe246f4e41357a43a1f53acd056d","./cases":"840286fbc948797f7c81c0ca12fa4128","./strings":"28eddeffb9df4d86bc76e582a320ef5d"}],"a3faed8e762a679a045dedb115d77756":[function(require,module,exports) {
var global = arguments[3];

const {
  merge,
  mergeAll
} = require("./scope");

const T = require("./types");

let S = {};

if (!global._X_LOOP_BREAK_) {
  global._X_LOOP_BREAK_ = Symbol("BREAK_LOOP");
  global._X_ANY_ = Symbol("ANY");
  global._X_ALL_ = Symbol("ALL");
}

S.BREAK = global._X_LOOP_BREAK_;
S.ANY = global._X_ANY_;
S.ALL = global._X_ALL_;

S.item = function item(s, i) {
  if (!T.isVal(s)) return undefined;
  if (T.isObj(s)) return s[i];
  if (T.isStr(s)) return s[i];
  if (T.isArr(s)) return s[i];else return s.item(i);
};

S.contains = function contains(s, v, k) {
  if (!T.isArr(s) && T.isObj(s)) return s[k] === v;
  return s.indexOf(v) >= 0;
};

S.add = function add(src, ...v) {
  if (T.isArr(src)) {
    S.ForEach(v, vi => src.push(vi)); // src.push(v);
  } else if (T.isMutableList(src)) {
    src.add(v);
  }
};

S.remove = function remove(src, ...it) {
  it = S.FlatMap(it);
  let any = false;
  S.ForEach(it, item => {
    let idx = src.indexOf(item);

    if (idx >= 0) {
      any = true;
      src.splice(idx, 1);
    }
  });
  return any;
};

S.toggle = function toggle(src, ...c) {
  if (c.length === 0) return;
  c = S.FlatMap(c);
  let idx = undefined;

  if (c.length === 1) {
    if (!S.remove(src, c)) {
      S.add(src, c[0]);
    }
  } else {
    c.push(c[0]);
    let any = false;
    S.ForEach(src, (cl, i) => {
      idx = c.indexOf(cl);

      if (idx >= 0 && c.length > idx + 1) {
        any = true;
        src[i] = c[idx + 1];
      }
    });

    if (!any) {
      src.push(c[0]);
    }
  }
};

S.objMatchOne = function objMatchOne(o, match) {
  let m = Object.keys(match);

  for (let k of m) {
    // if (!T.isObj(o[k])) continue;
    if (match[k] === S.ANY && o.hasOwnProperty(k)) return true;
    if (match[k] === o[k]) return true;
  }

  return false;
};

S.objMatchAll = function objMatchAll(o, match) {
  let m = Object.keys(match);

  for (let k of m) {
    // if (!T.isObj(o[k])) return false;
    if (match[k] === S.ANY) continue;
    if (match[k] !== o[k]) return false;
  }

  return true;
};

function funOrEq(f, def, inc = true) {
  if (T.isUnd(f)) return def;
  if (T.isFun(f)) return f;else if (f instanceof RegExp) return v => !T.isObj(v) ? f.test(v.toString()) : false;else if (T.isObj(f)) {
    if (Object.keys(f).length === 0) return def;
    return inc ? v => S.objMatchOne(v, f) : v => S.objMatchAll(v, f);
  } else return v => v === f;
}

S.DeepClone = function (src, opt = {
  skips: [],
  maxLevel: 999
}, lvl = 0) {
  if (lvl >= opt.maxLevel) return src;
  let cl = T.isArr(src) ? [] : {};

  for (let k in src) {
    if (src.hasOwnProperty(k)) {
      if (opt.skips && S.contains(opt.skips, k)) continue;
      let val = src[k];

      if (!T.isPrim(val)) {
        val = S.DeepClone(val, opt, lvl++);
      }

      if (T.isArr(cl)) {
        cl.push(val);
      } else {
        cl[k] = val;
      }
    }
  }

  return cl;
};

S.DeepConcat = function (o1, o2) {
  if (T.isStr(o1)) {
    return o1.concat(o2);
  }

  if (T.isArr(o1)) {
    return o1.concat(o2);
  }

  let d = o1;

  for (let k of Object.keys(o2)) {
    if (T.isArr(o2[k])) {
      if (!T.isVal(o1[k])) o1[k] = [];
      S.DeepConcat(o1[k], o2[k]);
    } else if (T.isObj(o2[k])) {
      if (!T.isVal(o1[k])) o1[k] = {};
      S.DeepConcat(o1[k], o2[k]);
    } else d[k] = o2[k];
  }

  return d;
};

S.ForRange = function (src, func, start = 0, end) {
  if (!T.isArr(src) || !T.isStr(src)) {
    let keys = Object.keys(src);
    end = end || keys.length - 1;

    for (let i = start; i <= end; i++) {
      let r = func(src[keys[i]], keys[i], i, src);
      if (r === S.BREAK) return i;
    }

    return end;
  }

  end = end || src.length;

  for (let i = start; i < end; i++) {
    let r = func(S.item(src, i), i, i, src);
    if (r === S.BREAK) return i;
  }

  return end;
};

S.ForEach = function (src, func) {
  if (!T.isVal(src)) return -1;

  if (!T.isArr(src) || !T.isStr(src) || !T.isList(src)) {
    let i = 0;
    let keys = Object.keys(src);
    const len = keys.length;

    for (; i < len; i++) {
      // let r = ;
      const k = keys[i],
            v = src[k];
      if (func(v, k, i, src) === S.BREAK) return i;
    }

    return i;
  }

  const len = src.length;

  if (!T.isArr(src)) {
    for (let i = 0; i < len; i++) {
      const v = src[i];
      let r = func(v, i, i, src);
      if (r === S.BREAK) return i;
    }
  } else {
    for (let i = 0; i < len; i++) {
      const v = S.item(src, i);
      let r = func(v, i, i, src);
      if (r === S.BREAK) return i;
    }
  }

  return src.length;
};

S.ForEachRTL = function (src, func, range = []) {
  if (!T.isArr(src) || !T.isStr(src)) {
    let i = 0;
    let keys = Object.keys(src);

    for (let i = keys.length - 1; i >= 0; i--) {
      if (i < range[1]) continue;
      if (i >= range[0]) return i;
      let r = func(src[keys[i]], keys[i], i, src);
      if (r === S.BREAK) return i;
    }

    return i;
  }

  for (let i = src.length - 1; i >= 0; i--) {
    let r = func(S.item(src, i), i, i, src);
    if (r === S.BREAK) return i;
  }

  return src.length;
};

S.ArrayForEach = function (src, func) {
  let arr = Array.from(src);
  let rev = S.ForEach(arr, func);
  return rev < arr.length ? arr.slice(0, rev) : arr;
};

S.ArrayForEachRTL = function (src, func) {
  let arr = Array.from(src);
  let rev = S.ForEachRTL(arr, func);
  return rev < arr.length ? arr.slice(0, rev) : arr;
};

S.First = function (src, func) {
  // if (!func) return item(src, 0);
  func = funOrEq(func, () => true);
  let r;
  S.ForEach(src, function (v, k, i) {
    r = func(v, k, i);

    if (r === true) {
      r = v;
      return S.BREAK;
    }
  });
  return r;
};

S.StartsWith = function (src, func) {
  func = funOrEq(func, () => true);
  return func(S.First(src));
};

S.Last = function (src, func) {
  // if (!func) return item(src, 0);
  func = funOrEq(func, () => true);
  let r;
  S.ForEachRTL(src, function (v, k, i) {
    r = func(v, k, i);

    if (r === true) {
      r = v;
      return S.BREAK;
    }
  });
  return r;
};

S.Reverse = function (src) {
  if (T.isArr(src)) return src.reverse();
  let rev = "";
  S.ForEachRTL(src, function (it) {
    rev += it;
  });
  return rev;
};
/**
 *
 * @param src
 * @param func
 * @return {boolean}
 * @constructor
 */


S.Any = function (src, func) {
  // if (!func){
  //     if (T.isArr(src) || T.isStr(src)) return src.length>0;
  //     return Object.keys(src).length>0;
  // }
  let fn = funOrEq(func);
  let r = false;
  S.ForEach(src, function (v, k, i, src) {
    r = fn(v, k, i, src);
    if (r === true) return S.BREAK;
  });
  return r;
};

S.All = function (src, func) {
  func = funOrEq(func, () => true);
  let r = true;
  S.ForEach(src, function (v, k, i, src) {
    r = func(v, k, i, src);
    if (r === false) return S.BREAK;
  });
  return r;
};

function filterS(src, pred, right = false) {
  pred = funOrEq(pred, () => true);
  let res = "";
  let loop = right ? S.ForEachRTL : S.ForEach;
  loop(src, function (v, k, i) {
    if (!pred || pred(v, k, i, src) === true) res += v;
  });
  return res;
}

function filterO(src, pred, right = false) {
  if (T.isArr(pred)) {
    let a = S.DeepClone(pred);

    pred = (v, k, i) => {
      return S.Any(a, k);
    };
  } else pred = funOrEq(pred, () => true);

  let res = {};
  let loop = right ? S.ForEachRTL : S.ForEach;
  loop(src, function (v, k, i) {
    if (pred(v, k, i, src) === true) res[k] = v;
  });
  return res;
}

function filterA(src, pred, right = false) {
  if (T.isArr(pred)) {
    let a = S.DeepClone(pred);

    pred = (v, k, i, src) => S.Any(a, i);
  } else pred = funOrEq(pred, () => true);

  let res = []; // let loop = right? I.ForEachRTL: I.ForEach;

  const len = src.length;

  if (!right) {
    for (let i = 0; i < len; i++) {
      const v = src[i];

      if (pred(v, i, i, src) === true) {
        res.push(v);
      }
    }
  } else {
    for (let i = len; i >= 0; i--) {
      const v = src[i];

      if (pred(v, i, i, src) === true) {
        res.push(v);
      }
    }
  } // loop(src, function (v, k, i) {
  //     if (pred(v, k, i, src) === true) {
  //         res.push(v);
  //     }
  // });


  return res;
}

S.Filter = function (src, pred, right = false) {
  if (T.isStr(src)) return filterS(src, pred, right);
  if (T.isArr(src) || T.isList(src)) return filterA(src, pred, right);
  return filterO(src, pred, right);
};

S.FilterRTL = function (src, func) {
  return S.Filter(src, func, true);
};

function mapA(src, func, right = false) {
  let res = [];
  let loop = right ? S.ForEachRTL : S.ForEach;
  loop(src, function (a, i) {
    let r = func(a, i, src);
    if (!T.isUnd(r)) res.push(r);
  });
  return res;
}

function mapO(src, func, right = false) {
  let res = {};
  let loop = right ? S.ForEachRTL : S.ForEach;
  loop(src, function (v, k, i) {
    let r = func(v, k, i, src);
    if (!T.isUnd(r)) res[k] = r;
  });
  return res;
}

S.Map = function (src, func, right = false) {
  func = funOrEq(func, v => v);
  if (T.isArr(src)) return mapA(src, func);else if (T.isObj(src)) return mapO(src, func);
};

S.FlatMap = function (src, func) {
  let res;
  if (T.isStr(src)) res = "";else if (T.isArr(src)) res = [];else res = {};
  S.ForEach(src, function (a, i) {
    let f;

    if (!!func) {
      f = func(a, i, src);
    } else {
      if (!T.isArr(res) && T.isObj(res)) {
        f = {};
        f[i] = a;
      } else {
        f = a;
      }
    }

    res = S.DeepConcat(res, f);
  });
  return res;
};

S.keyValuePairs = function (object) {
  let entries = [];
  S.ForEach(object, (v, k) => {
    entries.push(T.dict(k, v));
  });
  return entries;
};

S.entries = function (object) {
  let entries = [];
  S.ForEach(object, (v, k) => {
    entries.push([k, v]);
  });
  return entries;
};

S.merge = merge;
S.mergeAll = mergeAll;

S.startsWith = function (str, s) {
  return str.indexOf(s) === 0;
};

S.endsWith = function (str, s) {
  return S.Last(str) === s;
};

module.exports = S;
},{"./scope":"3e818b6d40d5f6d7b4a0b511d3073538","./types":"1a7bbe246f4e41357a43a1f53acd056d"}],"840286fbc948797f7c81c0ca12fa4128":[function(require,module,exports) {
function kebab(name) {
  let kb = "";
  let pres = false;

  for (let i = 0; i < name.length; i++) {
    let c = name.charAt(i);

    if (c === '_') {
      kb += '-';
      pres = true;
      continue;
    }

    if (c >= 'A' && c <= 'Z') {
      if (i > 0 && !pres) {
        kb += '-';
      }
    }

    kb += c.toLowerCase();
    pres = false;
  }

  return kb;
}

function snake(name) {
  let snk = "";
  let pres = false;

  for (let i = 0; i < name.length; i++) {
    let c = name.charAt(i);

    if (c === '-') {
      snk += '_';
      pres = true;
      continue;
    }

    if (c >= 'A' && c <= 'Z') {
      if (i > 0 && !pres) {
        snk += '_';
      }
    }

    snk += c.toLowerCase();
    pres = false;
  }

  return snk;
}

function camel(name) {
  let cml = "";
  let pres = false;

  for (let i = 0; i < name.length; i++) {
    let c = name.charAt(i);

    if (c === '-' || c === '_') {
      pres = true;
    } else if (pres === true) {
      cml += c.toUpperCase();
      pres = false;
    } else {
      if (i === 0) {
        cml += c.toLowerCase();
      } else {
        cml += c;
      }
    }
  }

  return cml;
}

function pascal(name) {
  let psc = "";
  let pres = false;

  for (let i = 0; i < name.length; i++) {
    let c = name.charAt(i);

    if (c === '-' || c === '_') {
      pres = true;
    } else if (pres === true) {
      psc += c.toUpperCase();
      pres = false;
    } else {
      if (i === 0) {
        psc += c.toUpperCase();
      } else {
        psc += c;
      }
    }
  }

  return psc;
}

module.exports = {
  kebab,
  camel,
  pascal,
  snake
};
},{}],"28eddeffb9df4d86bc76e582a320ef5d":[function(require,module,exports) {
const S = {}; // const numRegex = /^0[xXbB][\daAbBcCdDeEfF]+$|^\d*\.?\d+$/

S.numRegex = /0[xXbB][\daAbBcCdDeEfF]+|\d*\.?\d+/;
S.getNumberRegex = /(0[xXbB][\daAbBcCdDeEfF]+|\d*\.?\d+)([a-zA-Z]+)/g;

S.isNumeric = function (s) {
  return S.numRegex.test(s);
};

S.getNumeric = function (s) {
  let all = s.matchAll(S.getNumberRegex);
  let arr = [];

  do {
    let m = all.next();
    if (m.done) break;
    arr.push(m);
  } while (true);

  return arr;
};

module.exports = S;
},{}],"244ef49a3ac277ccaa8adb2d808e6f8e":[function(require,module,exports) {
const scope = require('../core/scope');

module.exports = scope.mergeAll(require('./query'), require('./event'), require('./classes'), require('./attributes'), require('./position'), require('./append'), require('./patch'));
},{"../core/scope":"3e818b6d40d5f6d7b4a0b511d3073538","./query":"21a6f0fee9b8c5efa07ee9301947819b","./event":"7c127826cb5920c1763388cd5b225f2f","./classes":"2b0c37c10550eef8b271bc1a1f6835b9","./attributes":"b684807e4c77a99ba86821efd6dbac5a","./position":"a1601387a196517467f3843cab542311","./append":"fea641fc83e42e298a4e4c13920de987","./patch":"f651dfb2eca7e9a863b6009b935c26be"}],"21a6f0fee9b8c5efa07ee9301947819b":[function(require,module,exports) {
var global = arguments[3];

const T = require("../core/types");

const L = require("../core/logging");

let X = {};
X.$DOC = global.document || {};
X.$BODY = X.$DOC.body || {};
X.$HEAD = X.$DOC.head || {};

X.$ = function (q, root = document) {
  if (T.isEl(q)) return Array.of(q);
  if (T.isEls(q)) return q;

  if (!T.isStr(q)) {
    L.error(`Query is not string nor element X.$(${q})`);
    return null;
  }

  if (!T.isEl(root)) {
    L.error(`Query root is not a node!\t[X.$(${q}, ${root})]`);
    return null;
  }

  return Array.from(root.querySelectorAll(q));
};

X.$$ = function (q, root = document) {
  if (T.isEl(q)) return q;

  if (!T.isStr(q)) {
    L.error(`Query is not string nor element X.$$(${q})`);
    return null;
  }

  if (!T.isEl(root)) {
    L.error(`Query root is not a node!\t[X.$(${q}, ${root})]`);
    return null;
  }

  return Array.of(root.querySelector(q));
};

module.exports = X;
},{"../core/types":"1a7bbe246f4e41357a43a1f53acd056d","../core/logging":"a02fa9eb1b6522eefcfa0521c70b6377"}],"7c127826cb5920c1763388cd5b225f2f":[function(require,module,exports) {
const scope = require("../core/scope");

const T = require("../core/types");

const I = require("../core/stream");

const L = require("../core/logging");
/**
 *
 * @param target {Node|Element}
 * @param event {String|Array}
 * @param listener {Function}
 * @param options {AddEventListenerOptions}
 */


function setEvent(target, event, listener, options) {
  if (!scope.isBrowser()) {
    L.error("Events are browser only!");
    return;
  }

  if (!T.isArr(event)) {
    if (I.contains(event, ' ')) {
      event = event.split(' ').Map(it => it.trim());
    } else event = [event];
  }

  target.__EVENTS__ = target.__EVENTS__ || {};
  I.ForEach(event, function (ev) {
    target.__EVENTS__[ev] = target.__EVENTS__[ev] || [];

    let f = function (e) {
      listener(e, target);
    };

    if (!T.hasField(options, 'duplicates', a => a)) {
      // console.log('removing dups')
      target.__EVENTS__[ev] = I.Filter(target.__EVENTS__[ev], fl => {
        if (T.funcEqual(fl.l, listener)) {
          target.removeEventListener(ev, fl.f, fl.o);
          return false;
        } else {
          console.log('notEqual', fl.l.toString(), listener.toString());
        }
      });
    }

    target.__EVENTS__[ev].push({
      f: f,
      l: listener,
      o: options
    });

    target.addEventListener(ev, f, options);
  });
}

function clearEvent(target, event) {
  if (!scope.isBrowser()) {
    L.error("Events are browser only!");
    return;
  }

  if (!T.isArr(event)) {
    if (I.contains(event, ' ')) {
      event = event.split(' ').Map(it => it.trim());
    } else event = [event];
  }

  target.__EVENTS__ = target.__EVENTS__ || {};
  if (T.isEmpty(target.__EVENTS__)) return;
  I.ForEach(event, function (ev) {
    target.__EVENTS__[ev] = target.__EVENTS__[ev] || [];
    if (T.isEmpty(target.__EVENTS__[ev])) return;
    I.ForEach(target.__EVENTS__[ev], fl => {
      target.removeEventListener(ev, fl.f, fl.o);
      return false;
    });
    target.__EVENTS__[ev] = [];
  });
}

module.exports = {
  setEvent,
  clearEvent
};
},{"../core/scope":"3e818b6d40d5f6d7b4a0b511d3073538","../core/types":"1a7bbe246f4e41357a43a1f53acd056d","../core/stream":"a3faed8e762a679a045dedb115d77756","../core/logging":"a02fa9eb1b6522eefcfa0521c70b6377"}],"2b0c37c10550eef8b271bc1a1f6835b9":[function(require,module,exports) {
const S = require("../core/scope");

const T = require("../core/types");

const I = require("../core/stream");

class Classes {
  static split(className) {
    return className.trim().replace(/\s+/, ' ').split(' ');
  }

  constructor(e) {
    this.element = e;
    Object.defineProperty(this, 'items', {
      get() {
        return this.classes;
      },

      set(v) {
        let upd = false;
        if (this.classes) upd = true;
        if (!T.isVal(v) || T.isEmpty(v)) this.classes = [];else if (T.isArr(v)) this.classes = v;else if (T.isStr(v)) this.classes = Classes.split(v);else if (v instanceof DOMTokenList) this.classes = Array.from(v);
        if (upd) this.__update__();
      }

    });
    this.items = e.getAttribute('class');
  }

  static of(e) {
    return new Classes(e);
  }

  __update__() {
    this.element.setAttribute('class', this.classes.join(' '));
  }

  contains(...c) {
    c = I.FlatMap(c);
    return I.All(c, it => I.contains(this.classes, it));
  }

  add(...c) {
    c = I.FlatMap(c);
    I.ForEach(c, it => {
      if (!this.contains(it)) {
        this.classes.push(it.toString());
      }
    });

    this.__update__();
  }

  remove(...c) {
    c = I.FlatMap(c);
    let l = this.classes.length;
    this.classes = I.Filter(this.classes, it => {
      return !I.Any(c, ci => ci.endsWith('*') ? it.startsWith(ci.replace('*', '')) : it === ci);
    });

    this.__update__();

    return l !== this.classes.length;
  }

  toggle(...c) {
    I.toggle(this.classes, c);

    this.__update__();
  }

}

Object.seal(Classes);

function cls(e) {
  return Classes.of(e);
}

function addClass(e, ...c) {
  Classes.of(e).add(c);
}

function removeClass(e, ...c) {
  Classes.of(e).remove(c);
}

function hasClass(e, ...c) {
  Classes.of(e).contains(c);
}

function toggleClass(e, ...c) {
  Classes.of(e).toggle(c);
}

module.exports = {
  Classes,
  cls,
  addClass,
  hasClass,
  removeClass,
  toggleClass
};
},{"../core/scope":"3e818b6d40d5f6d7b4a0b511d3073538","../core/types":"1a7bbe246f4e41357a43a1f53acd056d","../core/stream":"a3faed8e762a679a045dedb115d77756"}],"b684807e4c77a99ba86821efd6dbac5a":[function(require,module,exports) {
const I = require("../core/stream");

const T = require("../core/types");

function getAttributes(e) {
  let atr = {};
  I.ForEach(e.getAttributeNames(), n => atr[n] = e.getAttribute(n));
  return atr;
}

function hasAttr(a, v) {
  if (this.element.hasAttribute(a)) {
    if (v) return this.element.getAttribute(a) === v;
    return true;
  }

  return false;
}

function getAttr(e, a) {
  return e.getAttribute(a);
}

function setAttr(e, a, v) {
  if (T.isArr(a)) {
    I.ForEach(a, n => this.set(n, v));
  } else if (T.isObj(a)) {
    I.ForEach(a, (v, k) => this.set(k, v));
  } else {
    e.setAttribute(a, v);
  }
}

class Attributes {
  constructor(e) {
    this.element = e;
  }

  keys() {
    return this.element.getAttributeNames();
  }

  all() {
    return getAttributes(this.element);
  }

  set(a, v) {
    setAttr(this.element, a, v);
    return this;
  }

  get(a) {
    return getAttr(this.element, a);
  }

  has(a, v) {
    return hasAttr(a, v);
  }

  remove(a) {
    this.set(a, undefined);
  }

}

function attrs(e) {
  return new Attributes(e);
}

module.exports = {
  getAttributes,
  Attributes,
  getAttr,
  hasAttr,
  setAttr,
  attrs
};
},{"../core/stream":"a3faed8e762a679a045dedb115d77756","../core/types":"1a7bbe246f4e41357a43a1f53acd056d"}],"a1601387a196517467f3843cab542311":[function(require,module,exports) {
let E = {};

function left(e) {
  return e.offset;
}

function leftW(e) {
  return e.clientLeft;
}

function width(e) {
  return e.offsetWidth;
}

function widthW(e) {
  return e.clientWidth;
}

function right(e) {
  return left(e) + width(e);
}

function rightW(e) {
  return leftW(e) + widthW(e);
}

module.exports = {
  left,
  width,
  right
};
},{}],"fea641fc83e42e298a4e4c13920de987":[function(require,module,exports) {
function append(parent, ...elements) {
  window.dispatchEvent(new CustomEvent("x.dom.append", {
    detail: {
      parent,
      elements
    }
  }));
  parent.append(elements);
}

module.exports = {
  append
};
},{}],"f651dfb2eca7e9a863b6009b935c26be":[function(require,module,exports) {
const {
  isVal,
  isObj,
  isEl,
  hasField
} = require("../core/types");

const {
  ForEach
} = require("../core/stream");

const {
  setAttr
} = require("./attributes");

const {
  cls
} = require("./classes");

const {
  error
} = require("../core/logging");

function patch(node, object) {
  if (!isVal(node)) {
    error(`Node is ${node}`);
    return;
  }

  if (!isEl(node)) {
    error(`"${node}" is not Element or Node`);
    return;
  }

  if (hasField(object, 'attr')) {
    if (isObj(object['attr'])) {
      ForEach(object['attr'], (v, k) => {
        setAttr(node, k, v);
      });
    }
  }

  if (hasField(object, 'cls')) {
    if (isObj(object['cls'])) {
      let c = cls(node);
      ForEach(object['cls'], (v, k) => {
        c[k](v);
      });
    }
  }

  if (hasField(object, 'prop')) {
    if (isObj(object['prop'])) {
      ForEach(object['prop'], (v, k) => {
        node[k] = v;
      });
    }
  }
}

module.exports = {
  patch
};
},{"../core/types":"1a7bbe246f4e41357a43a1f53acd056d","../core/stream":"a3faed8e762a679a045dedb115d77756","./attributes":"b684807e4c77a99ba86821efd6dbac5a","./classes":"2b0c37c10550eef8b271bc1a1f6835b9","../core/logging":"a02fa9eb1b6522eefcfa0521c70b6377"}],"59b1590a42565cf7e06639724c685dde":[function(require,module,exports) {
const scope = require('../core/scope');

module.exports = scope.mergeAll(require('./request'), require('./response'), require('./ajax'), require('./methods'), require('./client'));
},{"../core/scope":"3e818b6d40d5f6d7b4a0b511d3073538","./request":"c8c80fc1b36dd2bdcbd000f9da1175ba","./response":"08935a8f6344a7ac41afc82e55129fa9","./ajax":"3faf1b51ee1b19f717689eb8e845d8bd","./methods":"2289188c0eb641f9eab96ddfb6a347a3","./client":"456ac80408756e6494fd35c8b445e1ea"}],"c8c80fc1b36dd2bdcbd000f9da1175ba":[function(require,module,exports) {
var _temp;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const T = require("../core/types");

let R = {};
R.HttpContent = (_temp = class {
  constructor(type, data) {
    _defineProperty(this, "type", void 0);

    _defineProperty(this, "data", void 0);

    this.type = type;
    this.data = data;
  }

}, _temp);
R.HttpRq = class {
  setMethod(m) {
    this.method = m.toUpperCase();
  }

  setUrl(u) {
    this.url = encodeURI(u);
  }

  setArg(n, v) {
    this.args[n] = v;
  }

  buildUrlEncoded(args) {
    let ue = "";
    args = args || this.args;
    let argNames = Object.keys(args);

    if (argNames.length > 0) {
      for (let i = 0; i < argNames.length; i++) {
        ue += encodeURIComponent(argNames[i]) + '=' + encodeURIComponent(args[argNames[i]]);

        if (i < argNames.length - 1) {
          ue += '&';
        }
      }
    }

    return ue;
  }

  setHeader(n, v) {
    this.headers[n] = v.toString();
  }

  getHeader(n) {
    return this.headers[n];
  }

  setContent(contentType, data) {
    this.content.type = contentType.toLowerCase();
    this.content.data = data;
  }

  jsonContent(data) {
    let str = "";

    if (typeof data === "string") {
      str = data;
    } else {
      str = JSON.stringify(data);
    }

    this.setContent('json', str);
    this.setHeader('Content-Type', 'application/json');
  }

  xmlContent(data) {
    if (T.isStr(data)) this.setContent('xml', data);else this.setContent('xml', data.outerHTML);
    this.setHeader('Content-Type', 'application/xml');
  }

  /**
   *
   * @param form {string} form id
   */
  formContent(form) {
    //TODO make form data from element id
    let formElement = form;
    let frm = new FormData(formElement);
    this.formMultiPartContent(frm);
  }

  /**
   * @param frm {FormData} custom form data object
   */
  formMultiPartContent(frm) {
    this.setContent('form_multipart', frm); // this.setHeader('Content-Type', 'multipart/form-data; boundary=' + frm.boundary)
  }

  // application/x-www-form-urlencoded
  formUrlEncodedContent(data) {
    this.setContent('form_urlencoded', this.buildUrlEncoded(data));
    this.setHeader('Content-Type', 'application/x-www-form-urlencoded');
  }

  /**
   *
   * @param method {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'|'OPTIONS'?}
   * @param url {String?}
   * @param args {{name: value}?}
   * @param headers {{name: value}?}
   * @param content {R.HttpContent?}
   */
  constructor(method, url, args, headers, content) {
    this.args = args || {};
    this.headers = headers || {};
    this.content = content || new R.HttpContent('#urlencoded', {});
    this.setMethod(method);
    this.setUrl(url);
  }

};
module.exports = R;
},{"../core/types":"1a7bbe246f4e41357a43a1f53acd056d"}],"08935a8f6344a7ac41afc82e55129fa9":[function(require,module,exports) {
var _temp;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require("../core/types");

let R = {};
R.HttpRs = (_temp = class {
  constructor(xhr) {
    _defineProperty(this, "json", void 0);

    _defineProperty(this, "xml", void 0);

    this.xhr = xhr;
    this.status = {
      code: xhr.status,
      text: xhr.statusText
    };
    this.headers = xhr.getAllResponseHeaders();
    this.contentLength = xhr.response.length || 0;
    this.data = xhr.response;
    this.text = xhr.responseText;
    Object.defineProperty(this, 'json', {
      get() {
        if (!this.xhr.responseJSON) {
          this.xhr.responseJSON = JSON.parse(this.xhr.responseText);
        }

        return this.xhr.responseJSON;
      }

    });
    Object.defineProperty(this, 'xml', {
      get() {
        if (!this.xhr.responseXML) {
          let parser = new DOMParser();
          this.xhr.responseXML = parser.parseFromString(self.text, "text/xml");
        }

        return this.xhr.responseXML;
      }

    });
  }

}, _temp);
module.exports = R;
},{"../core/types":"1a7bbe246f4e41357a43a1f53acd056d"}],"3faf1b51ee1b19f717689eb8e845d8bd":[function(require,module,exports) {
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const S = require("../core/scope");

const Rq = require("./request");

const Rs = require("./response");

const T = require("../core/types");

const I = require("../core/stream");

class Ajax {
  constructor(m, url, params = {}, headers = {}, content = new Rq.HttpContent()) {
    _defineProperty(this, "Rq", {});

    _defineProperty(this, "Rs", {});

    if (m instanceof Rq.HttpRq) {
      this.Rq = m;
    } else {
      this.Rq = new Rq.HttpRq(m, url, params, headers, content);
    } // Fields


    this.Rs = {
      readyState: 0
    };
    this.xhr = new XMLHttpRequest(); // Events

    this.preparedCallback = function (rq) {// to be overridden
    };

    this.progressCallback = function (ev, rq) {// to be overridden
    };

    this.uploadProgressCallback = function (xhr) {};

    this.successCallback = function (rq, rs) {// to be overridden
      // console.log('REQUEST:', rq, 'RESPONSE:', rs)
    };

    this.uploadFinishCallback = function (xhr) {};

    this.failCallback = function (rq, rs) {// to be overridden
      // console.log('REQUEST:', rq, 'RESPONSE:', rs)
    };

    Object.defineProperty(this, 'xhr', {
      enumerable: false
    }); // Object.seal(this);
  } // Methods


  header(n, v) {
    this.Rq.setHeader(n, v);
    return this;
  }

  headers(hdrs) {
    I.ForEach(hdrs, (v, k) => {
      this.Rq.setHeader(k, v);
    });
    return this;
  }

  onSuccess(callbackRqRs) {
    this.successCallback = callbackRqRs;
    return this;
  }

  onUploadSuccess(callbackRqRs) {
    this.uploadFinishCallback = callbackRqRs;
    return this;
  }

  onFail(callbackRqRs) {
    this.failCallback = callbackRqRs;
    return this;
  }

  onProgress(callbackRqRs) {
    this.progressCallback = callbackRqRs;
    return this;
  }

  onUploadProgress(callbackRqRs) {
    this.uploadProgressCallback = callbackRqRs;
    return this;
  }

  withContent(content) {
    this.Rq.setContent(content.type, content.data);
  }

  xmlData(data) {
    this.Rq.xmlContent(data);
    return this;
  }

  formData(form) {
    this.Rq.formContent(form);
    return this;
  }

  jsonData(data) {
    this.Rq.jsonContent(data);
    return this;
  }

  urlEncodedData(data) {
    this.Rq.formUrlEncodedContent(data);
    return this;
  }

  _prepare(reset) {
    if (this.isPrepared && !reset) {
      // self.onprepare && self.onprepare(self.Rq);
      return this;
    } // prepare url


    let url = this.Rq.url;

    if (this.Rq.args && !T.isEmpty(this.Rq.args)) {
      url.indexOf('?') >= 0 || (url += '?');
      url += this.Rq.buildUrlEncoded();
    }

    reset && (this.xhr = new XMLHttpRequest());
    this.xhr.open(this.Rq.method, url); // prepare headers

    for (let h in this.Rq.headers) {
      if (this.Rq.headers.hasOwnProperty(h)) this.xhr.setRequestHeader(h, this.Rq.headers[h]);
    }

    this.isPrepared = true;
    this.preparedCallback && this.preparedCallback(this.Rq); // preparedCallback && preparedCallback();

    return this;
  }

  send(finishCallback) {
    // let rqi = X.AjaxInterceptors.__rq.First((ic)=>ic(this));
    this._prepare();

    let ajax = this;
    let xhr = this.xhr;

    this.xhr.onreadystatechange = function (ev) {
      // onloadend
      if (xhr.readyState === 4) {
        let callback;

        if (xhr.status >= 200 && xhr.status <= 399) {
          callback = ajax.successCallback;
        } else {
          callback = ajax.failCallback;
        }

        ajax.Rs = new Rs.HttpRs(xhr); // let rsi = X.AjaxInterceptors.__rs.First((ic)=>ic(this));

        finishCallback && finishCallback(ajax.Rq, ajax.Rs, ajax.xhr);
        callback && callback(ajax.Rq, ajax.Rs, ajax.xhr);
      }
    };

    this.xhr.onprogress = function (ev) {
      ajax.progressCallback && ajax.progressCallback(ev, ajax);
    };

    this.xhr.upload.onprogress = function (ev) {
      ajax.uploadProgressCallback && ajax.uploadProgressCallback(ev, ajax);
    };

    this.xhr.upload.onloadend = function (ev) {
      ajax.uploadFinishCallback && ajax.uploadFinishCallback(ev, ajax);
    };

    this.xhr.send(this.Rq.content.data);
    return ajax;
  }

}

module.exports = {
  Ajax: Ajax
};
},{"../core/scope":"3e818b6d40d5f6d7b4a0b511d3073538","./request":"c8c80fc1b36dd2bdcbd000f9da1175ba","./response":"08935a8f6344a7ac41afc82e55129fa9","../core/types":"1a7bbe246f4e41357a43a1f53acd056d","../core/stream":"a3faed8e762a679a045dedb115d77756"}],"2289188c0eb641f9eab96ddfb6a347a3":[function(require,module,exports) {
const Ajax = require("./ajax").Ajax;

const Rq = require("./request");

let Http = {}; // Http.Ajax = Ajax;

/**
 *
 * @param method {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'}
 * @param url {String}
 * @param params Object
 * @param headers Object
 * @param content {{type: ('json', 'urlencoded', 'form', '*'), data: Object|String}}
 * @param callbacks {{success:Function?, fail: Function?, progress: Function?, prepare: Function?,
 * uploadProgress: Function?, uploadFinish: Function?}}
 * @return {Ajax}
 */

Http.makeHttpRequest = function (method, url, params, headers, content, callbacks) {
  let ajax = new Ajax(method.toUpperCase(), url, params, headers);

  if (content && content.type) {
    if (content.type.toLowerCase() === 'json') {
      ajax.jsonData(content.data);
    } else if (content.type.toLowerCase() === 'urlencoded') {
      ajax.urlEncodedData(content.data);
    } else if (content.type.toLowerCase() === 'form') {
      ajax.formData(content.data);
    } else {
      ajax.Rq.setContent(content.type, content.data);
    }
  }

  callbacks.success && ajax.onSuccess(callbacks.success);
  callbacks.fail && ajax.onFail(callbacks.fail);
  callbacks.progress && ajax.onProgress(callbacks.progress);
  callbacks.prepare && (ajax.preparedCallback = callbacks.prepare);
  callbacks.uploadProgress && (ajax.uploadProgressCallback = callbacks.uploadProgress);
  callbacks.uploadFinish && (ajax.uploadFinishCallback = callbacks.uploadFinish);
  return ajax;
};
/**
 *
 * @param opts {{method, url, args, headers, type, data, success, fail, progress, prepare, uploadProgress, uploadFinish}}
 * @return {Ajax}
 */


Http.makeRequest = function (opts) {
  return Http.makeHttpRequest(opts.method || 'OPTIONS', opts.url, opts.args, opts.headers, new Rq.HttpContent(opts.type, opts.data), {
    success: opts.success,
    fail: opts.fail,
    progress: opts.progress,
    prepare: opts.prepare,
    uploadProgress: opts.uploadProgress,
    uploadFinish: opts.uploadFinish
  });
};

Http.makePromise = function (r) {
  return new Promise((res, rej) => {
    r.onSuccess(() => res(r));
    r.onFail(() => rej(r));
  });
};
/**
 *
 * @param opts {{method, url, args, headers, type, data, success, fail, progress, prepare, finish, uploadProgress, uploadFinish}}
 * @return {Promise<any>}
 */


Http.sendRequest = async function sendRequest(opts) {
  let r = Http.makeRequest(opts);
  r.send(opts.finish);
  return await Http.makePromise(r);
};

Http.Get = function (url, params) {
  return new Ajax('GET', url, params);
};

Http.Post = function (url, params) {
  return new Ajax('POST', url, params);
};

Http.Delete = function (url, params) {
  return new Ajax('DELETE', url, params);
};

Http.Put = function (url, params) {
  return new Ajax('PUT', url, params);
};

Http.Patch = function (url, params) {
  return new Ajax('PATCH', url, params);
};
/**
 * {@inheritDoc REST.sendRequest}
 * @return {Promise<*>}
 */


Http.sendGet = function (opt) {
  opt.method = 'GET';
  opt.type = undefined;
  opt.data = undefined;
  return Http.sendRequest(opt);
};

Http.sendDelete = function (opt) {
  opt.method = 'DELETE';
  return Http.sendRequest(opt);
};

Http.sendPost = function (opt) {
  opt.method = 'POST';
  return Http.sendRequest(opt);
};

Http.sendPut = function (opt) {
  opt.method = 'PUT';
  return Http.sendRequest(opt);
};

Http.sendPatch = function (opt) {
  opt.method = 'PATCH';
  return Http.sendRequest(opt);
};

module.exports = Http;
},{"./ajax":"3faf1b51ee1b19f717689eb8e845d8bd","./request":"c8c80fc1b36dd2bdcbd000f9da1175ba"}],"456ac80408756e6494fd35c8b445e1ea":[function(require,module,exports) {
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const http = require('./methods');

class InterceptorStore {
  constructor() {
    _defineProperty(this, "all", []);
  }

  use(interceptor) {
    this.all.push(interceptor);
  }

}

class XHttpClient {
  constructor(base_path = '') {
    _defineProperty(this, "base", void 0);

    _defineProperty(this, "queue", []);

    _defineProperty(this, "sending", []);

    _defineProperty(this, "interval", void 0);

    _defineProperty(this, "maxPerMinute", void 0);

    _defineProperty(this, "interceptors", {
      request: new InterceptorStore(),
      response: new InterceptorStore()
    });

    this.base = base_path;
  }

  async _intervalSend() {
    if (this.queue.length === 0) {
      clearInterval(this.interval);
      this.interval = undefined;
    } // fix promise


    let ajax = this.queue.pop();
    ajax.send();
  }

  _addRequest(ajax) {
    this.queue.push(ajax);

    if (!this.interval) {
      this.interval = setInterval(this._intervalSend, 1);
    }

    return http.makePromise(ajax);
  }

  send(ajax) {
    this._addRequest(ajax);
  }

  get(route, args = {
    params: {},
    headers: {}
  }) {
    return this._addRequest(http.Get(this.base + route, args.params).headers(args.headers));
  }

  _contentRequest(method, route, args) {
    return this._addRequest(method(this.base + route, args || {}).headers(args.headers || {}).withContent(args.content || {
      type: '',
      data: ''
    }));
  }

  post(route, args = {}, headers = {}, content) {
    return this._contentRequest(http.Post, route, args, headers, content);
  }

  put(route, args = {}, headers = {}, content) {
    return this._contentRequest(http.Put, route, args, headers, content);
  }

  patch(route, args = {}, headers = {}, content) {
    return this._contentRequest(http.Patch, route, args, headers, content);
  }

  delete(route, args = {}, headers = {}, content) {
    return this._contentRequest(http.Delete, route, args, headers, content);
  }

}
},{"./methods":"2289188c0eb641f9eab96ddfb6a347a3"}]},{},["aca60b261c3e8b39c0d970803513c352","eb397b394ebff17b5f4b9224cf897db4"], null)

//# sourceMappingURL=index.js.map
