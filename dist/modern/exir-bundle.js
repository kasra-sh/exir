!function(){var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},e={};function n(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(){return void 0!==t.window&&void 0!==t.document&&void 0!==t.navigator}r()||(t.HTMLElement=t.HTMLElement?t.HTMLElement:function(){},t.Element=t.Element?t.Element:function(){},t.Node=t.Node?t.Node:function(){},t.HTMLCollection=t.HTMLCollection?t.HTMLCollection:function(){},t.NodeList=t.NodeList?t.NodeList:function(){}),e={setGlobal:function(e){for(let n of Object.keys(e))t[n]=e[n]},Extension:class{constructor(t){n(this,"types",[]),n(this,"pcode","\n"),this.types=t}define(t){if(!t.name){let e=`Function must have a name [Extension.define(f)]\n<<${t}>>`;return console.error(e),`\n/**\n *${e}\n */`}let e="\n";for(let n of this.types)void 0!==n&&(e+=`${n.name||n}.prototype.${t.name} = `);return e+=t.toString()+";\n",this.pcode+=e,e}polyfill(t){if(!t.name){let e=`Extension function must have a name:\n<<${t}>>`;return console.error(e),`\n/**\n *${e}\n */`}let e="\n";for(let n of this.types)e+=`if (${n.name||n}.prototype.${t.name} === undefined) ${n.name||n}.prototype.${t.name} = ${t.toString()};\n`;this.pcode+=e}},isBrowser:r};var s,i,o={},a={};function l(t){return null!==t&&void 0===t}function u(t){return null===t}function c(t){return!l(t)&&!u(t)}function f(t){return"function"==typeof t}function h(t){return null!==t&&"object"==typeof t}function d(t,e,n){if(c(t))return f(n)?n(t[e]):t.hasOwnProperty(e)}a={typeName:function(t){return t.hasOwnProperty("constructor")?t.constructor.name:typeof t},isUnd:l,isNull:u,isVal:c,isNum:function(t){return"number"==typeof t},isStr:function(t){return"string"==typeof t||t instanceof String},isFun:f,isObj:h,isArr:function(t){return t instanceof Array},isPrim:function(t){return c(t)&&!h(t)&&!f(t)},isList:function(t){return c(t.length)&&f(t.item)},isMutableList:function(t){return c(t.length)&&f(t.item)&&f(t.add)},isSet:function(t){return t instanceof Set},isMap:function(t){return t instanceof Map},isError:function(t){return t instanceof Error},isEl:function(t){return t instanceof Element||t instanceof HTMLElement||t instanceof Node},isEls:function(t){return t instanceof HTMLCollection||t instanceof NodeList},hasField:d,isEmpty:function(t){return d(t,"length")?t.length<=0:!f(t)&&(!h(t)||Object.keys(t).length<=0)},Enum:function(t){let e=0,n={};for(let r of Object.keys(t))n[n[e]=r]=e++;return n},dict:function(...t){let e={};for(let n=0;n<t.length;n++)n%2==0&&(e[t[n]]=t[n+1]);return e}},t._X_LOOP_BREAK_||(t._X_LOOP_BREAK_=Symbol("BREAK_LOOP"),t._X_ANY_=Symbol("ANY"),t._X_ALL_=Symbol("ALL"));const p=t._X_LOOP_BREAK_,_=t._X_ANY_,m=t._X_ALL_,g=["__proto__","constructor","__defineGetter__","__defineSetter__","prototype"];function y(t,e){if(a.isVal(t))return a.isObj(t)||a.isStr(t)||a.isArr(t)?t[e]:t.item(e)}function b(t,e,n){return!!a.isVal(t)&&(!a.isArr(t)&&a.isObj(t)?t[n]===e:t.indexOf(e)>=0)}function E(t,...e){a.isArr(t)?A(e,e=>t.push(e)):a.isMutableList(t)&&t.add(e)}function v(t,...e){e=F(e);let n=!1;return A(e,e=>{let r=t.indexOf(e);r>=0&&(n=!0,t.splice(r,1))}),n}function C(t,e){let n=Object.keys(e);for(let r of n){if(e[r]===_&&t.hasOwnProperty(r))return!0;if(e[r]===t[r])return!0}return!1}function T(t,e){let n=Object.keys(e);for(let r of n)if(e[r]!==_&&e[r]!==t[r])return!1;return!0}function w(t,e=(()=>!0),n=!0){return a.isUnd(t)?e:a.isFun(t)?t:t instanceof RegExp?e=>!a.isObj(e)&&t.test(e.toString()):a.isObj(t)?0===Object.keys(t).length?e:n?e=>C(e,t):e=>T(e,t):e=>e===t}function O(t){if(a.isUnd(t))return t=>t;if(a.isFun(t))return t;if(a.isStr(t)){const e=t;t=t=>t[e]}throw Error(`Predicate ${t} cannot be of type ${typeof t}`)}function x(t,e={}){return a.isStr(t)?"":a.isList(t)?[]:a.isObj(t)?a.isEl(t)?3===t.nodeType||8===t.nodeType?document.createTextNode(t.textContent):document.createElement(t.tagName):t.__proto__?Object.create(t.__proto__):{}:e}function A(t,e){if(!a.isVal(t))return-1;if(!a.isArr(t)||!a.isStr(t)||!a.isList(t)){let n=0,r=Object.keys(t);const s=r.length;for(;n<s;n++){const s=r[n];if(e(t[s],s,n,t)===p)return n}return n}const n=t.length;if(a.isArr(t))for(let r=0;r<n;r++){if(e(y(t,r),r,r,t)===p)return r}else for(let r=0;r<n;r++){if(e(t[r],r,r,t)===p)return r}return t.length}function k(t,e,n=[]){if(!a.isArr(t)||!a.isStr(t)){let r=0,s=Object.keys(t);for(let r=s.length-1;r>=0;r--){if(r<n[1])continue;if(r>=n[0])return r;if(e(t[s[r]],s[r],r,t)===p)return r}return r}for(let n=t.length-1;n>=0;n--){if(e(y(t,n),n,n,t)===p)return n}return t.length}function S(t,e){e=w(e,()=>!0);let n=-1;return A(t,(function(r,s,i){if(n=e(r,s,i,t),!0===n)return n=i,p})),n}function L(t,e){return y(t,S(t,e))}function j(t,e){e=w(e,()=>!0);let n=-1;return k(t,(function(t,r,s){if(n=e(t,r,s),!0===n)return n=s,p})),n}function P(t,e){return t[j(t,e)]}function q(t,e){let n=w(e),r=!1;return A(t,(function(t,e,s,i){if(r=n(t,e,s,i),!0===r)return p})),r}function N(t,e){e=w(e,()=>!0);let n=!0;return A(t,(function(t,r,s,i){if(n=e(t,r,s,i),!1===n)return p})),n}function R(t,e,n=!1,r=!1){e=w(e,()=>!0);let s="";return(n?k:A)(t,(function(n,i,o){e&&e(n,i,o,t)!==r||(s+=n)})),s}function $(t,e,n=!1,r=!1){if(a.isArr(e)){let t=Object.assign({},e);e=r?(e,n)=>!q(t,n):(e,n)=>q(t,n)}else e=w(e,()=>!0);let s={};const i=Object.keys(t),o=i.length;if(n)for(let n=o-1;n>=0;n--){const o=i[n],a=t[o];e(a,o,n,t)!==r&&(s[o]=a)}else for(let n=0;n<o;n++){const o=i[n],a=t[o];e(a,o,n,t)!==r&&(s[o]=a)}return s}function M(t,e,n=!1,r=!1){if(a.isArr(e)){let t=Object.assign([],e);e=r?(e,n,r)=>!q(t,r):(e,n,r)=>q(t,r)}else e=w(e,()=>!0);let s=[];const i=t.length;if(n)for(let n=i-1;n>=0;n--){const i=t[n];!e(i,n,n,t)!==r&&s.push(i)}else for(let n=0;n<i;n++){const i=t[n];e(i,n,n,t)!==r&&s.push(i)}return s}function V(t,e,n=!1){return a.isStr(t)?R(t,e,n):a.isArr(t)||a.isList(t)?M(t,e,n):$(t,e,n)}function D(t,e){let n;e=O(e);let r=-1;return A(t,(function(t,s){let i=e(t,s);n?i>=n&&(n=i,r=s):(n=i,r=s)})),r}function U(t,e){let n;e=O(e);let r=-1;return A(t,(function(t,s){let i=e(t,s);n?i<=n&&(n=i,r=s):(n=i,r=s)})),r}function H(t,e,n=!1){return e=w(e,t=>t),a.isArr(t)?function(t,e,n=!1){let r=[];const s=t.length;if(n)for(let n=s;n>=0;n--){let s=e(t[n],n,t);if(s===p)break;a.isUnd(s)||r.push(s)}else for(let n=0;n<s;n++){let s=e(t[n],n,t);if(s===p)break;a.isUnd(s)||r.push(s)}return r}(t,e,n):a.isObj(t)?function(t,e,n=!1){let r={};const s=Object.keys(t),i=t.length;if(n)for(let n=i;n>=0;n--){const i=s[n];let o=e(t[i],i,n,t);if(o===p)break;a.isUnd(o)||(r[i]=o)}else for(let n=0;n<i;n++){const i=s[n];let o=e(t[i],i,n,t);if(o===p)break;a.isUnd(o)||(r[i]=o)}return r}(t,e,n):void 0}function F(t,e){let n;return n=a.isStr(t)?"":a.isArr(t)?[]:{},A(t,(function(r,s){let i;e?i=e(r,s,t):!a.isArr(n)&&a.isObj(n)?(i={},i[s]=r):i=r,n=function(t,e){if(a.isStr(t))return t.concat(e);if(a.isArr(t))return t.concat(e);let n=t;for(let t of Object.keys(e))a.isArr(e[t])||a.isObj(e[t])||(n[t]=e[t]);return n}(n,i)})),n}function I(t,e,n=t){return a.isUnd(e)&&(e=(t,e)=>t+e),A(t,(t,r,s)=>{n=e(n,t,r,s)}),n}function B(t,e,{excludeKeys:n=[],maxDepth:r=999,allowUnsafeProps:s=!1}={excludeKeys:[],maxDepth:999,allowUnsafeProps:!1},i=0){return i>=r||A(e,(o,l)=>{n&&b(n,l)||s&&b(g,l)||(a.isObj(e[l])?t[l]=B(x(e[l]),e[l],{excludeKeys:n,maxDepth:r,depth:i+1}):t[l]=o)}),t}o={ANY:_,ALL:m,BREAK:p,item:y,contains:b,add:E,remove:v,toggle:function(t,...e){if(0===e.length)return;e=F(e);let n=void 0;if(1===e.length)v(t,e)||E(t,e[0]);else{e.push(e[0]);let r=!1;A(t,(s,i)=>{n=e.indexOf(s),n>=0&&e.length>n+1&&(r=!0,t[i]=e[n+1])}),r||t.push(e[0])}},objMatchOne:C,objMatchAll:T,deepMerge:B,deepClone:function(t,{excludeKeys:e=[],maxDepth:n=999,allowUnsafeProps:r=!1}={excludeKeys:[],maxDepth:999,allowUnsafeProps:!1}){return B(x(t),t,{excludeKeys:e,maxDepth:n,allowUnsafeProps:r})},forN:function(t,e=0,n=0,r=(e<n?1:-1)){if(r>0)for(;e<=n;e+=r)t(e);for(;e>=n;e+=r)t(e)},forEachRange:function(t,e,n=0,r){if(!a.isArr(t)||!a.isStr(t)){let s=Object.keys(t);r=r||s.length-1;for(let i=n;i<=r;i++){if(e(t[s[i]],s[i],i,t)===p)return i}return r}r=r||t.length;for(let s=n;s<r;s++){if(e(y(t,s),s,s,t)===p)return s}return r},forEach:A,forEachRight:k,firstIndex:S,first:L,startsWith:function(t,e){return a.isStr(t)&&a.isStr(e)?0===t.indexOf(e):(e=w(e,()=>!0))(L(t))},lastIndex:j,last:P,endsWith:function(t,e){return a.isStr(t)&&a.isStr(e)?t.indexOf(e)===t.length-e.length:(e=w(e,()=>!0))(P(t))},reverse:function(t){if(a.isArr(t))return t.reverse();let e="";return k(t,(function(t){e+=t})),e},any:q,all:N,filter:V,filterRight:function(t,e){return V(t,e,!0)},reduce:I,reduceRight:function(t,e,n=t){k(t,(t,r,s)=>{n=e(n,t,r,s)})},map:H,flatMap:F,keyValuePairs:function(t){let e=[];return A(t,(t,n)=>{e.push(a.dict(n,t))}),e},entries:function(t){let e=[];return A(t,(t,n)=>{e.push([n,t])}),e},maxIndex:D,max:function(t,e){return t[D(t,e)]},minIndex:U,min:function(t,e){return t[U(t,e)]},translateObject:function(t,e){a.isArr(e)&&V(t,e);const n=Object.keys(e);let r=V(t,n);for(let t of n)r[e[t]]=r[t],delete r[t];return r},omit:function(t,e,n=!1){return a.isStr(t)?R(t,e,n,!0):a.isArr(t)||a.isList(t)?M(t,e,n,!0):$(t,e,n,!0)},join:function(t,...e){if(0===e.length)return[];if(!N(e,a.isArr))throw Error("Join only accepts arrays of data!");let n;if(a.isStr(t)){const e=t;n=t=>t[e]}else if(a.isArr(t))n=e=>I(e,(e,n,r)=>{if(b(t,r))return e+n},"");else if(!a.isFun(t))throw Error("Join key only accepts: String, [String,...], Function");n=t;const r={};return A(e,t=>{A(t,t=>{const e=n(t),s=r[e];r[e]=s?Object.assign(s,t):t})}),r},objectValues:function(t){return Object.values?Object.values(t):H(t,t=>t)}};var W={};function K(t){return`[${t}] [${function(){let t=new Date;return`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}:${t.getMilliseconds()}`}()}]`}function z(t,e){t.reverse(),t.push("display: inline-block; font-weight: bold; color: black","%c"+e),t.reverse()}const G=a.Enum({TRACE:0,INFO:0,WARN:0,ERROR:0,SILENT:0}),Q={LogLevel:G.TRACE};function J(t){return Q.LogLevel!==G.SILENT&&Q.LogLevel<=t}W={Config:Q,LogLevels:G,showTrace:function(){Q.LogLevel=G.TRACE},showInfo:function(){Q.LogLevel=G.INFO},showWarn:function(){Q.LogLevel=G.WARN},showError:function(){Q.LogLevel=G.ERROR},silent:function(){Q.LogLevel=G.SILENT},trace:function(...t){J(G.TRACE)&&(t.reverse(),t.push(K("X-TRACE")),t.reverse(),console.trace.apply(X,t))},info:function(...t){J(G.INFO)&&(z(t,K("X-INFO")),console.log.apply(X,t))},warn:function(...t){J(G.WARN)&&(z(t,K("X-WARN")),console.warn.apply(X,t))},error:function(...t){J(G.ERROR)&&(z(t,K("X-ERROR")),console.error.apply(X,t))}};var Y={};Y={kebab:function(t){let e="",n=!1;for(let r=0;r<t.length;r++){let s=t.charAt(r);"_"!==s?(s>="A"&&s<="Z"&&r>0&&!n&&(e+="-"),e+=s.toLowerCase(),n=!1):(e+="-",n=!0)}return e},camel:function(t){let e="",n=!1;for(let r=0;r<t.length;r++){let s=t.charAt(r);"-"===s||"_"===s?n=!0:!0===n?(e+=s.toUpperCase(),n=!1):e+=0===r?s.toLowerCase():s}return e},pascal:function(t){let e="",n=!1;for(let r=0;r<t.length;r++){let s=t.charAt(r);"-"===s||"_"===s?n=!0:!0===n?(e+=s.toUpperCase(),n=!1):e+=0===r?s.toUpperCase():s}return e},snake:function(t){let e="",n=!1;for(let r=0;r<t.length;r++){let s=t.charAt(r);"-"!==s?(s>="A"&&s<="Z"&&r>0&&!n&&(e+="_"),e+=s.toLowerCase(),n=!1):(e+="_",n=!0)}return e}};var Z;const tt=/^[-+]?\d*(\.\d+|\d*)(e[-+]?\d+)?$/,et=/^[-+]?[a-f0-9]+$/,nt=/^[-+]?[0][0-7]+$/,rt=/^[-+]?[01]+$/,st=/^[a-z0-9]([a-z0-9._%-+][a-z0-9]|[a-z0-9])*@[a-z0-9]([a-z0-9.-][a-z0-9]|[a-z0-9])*\.[a-z]{2,6}$/i;Z={isDecimal:function(t){return tt.test(t)},isHex:function(t){return et.test(t)},isOctal:function(t){return nt.test(t)},isBinary:function(t){return rt.test(t)},isEmail:function(t){return st.test(t)},startsWith:function(t,e){return 0===t.indexOf(e)},endsWith:function(t,e){return t.indexOf(e)===t.length-1},contains:function(t,e){return t.indexOf(e)>=0}};var it;function ot(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}class at{constructor(){ot(this,"__src__",void 0),ot(this,"keys",void 0)}get count(){return this.keys.length}static of(t){let e=new at;return e.__src__=t,e.keys=Object.keys(t),e.len=e.keys.length,e}slice(t=0,e=this.count-1){this.keys=this.keys.slice(t,e)}key(t=0){return this.keys[t]}value(t=0){return this.__src__[this.key(t)]}loop(t,e=!1){if(e)for(let e=this.count-1;e>=0&&null!==t(this.value(e),this.key(e),e);e--);else for(let e=0;e<this.count&&null!==t(this.value(e),this.key(e),e);e++);return this}values(t=!1){let e=[];return this.loop((function(t,n,r){e.push(t)}),t),e}item(t){if(void 0===t)return;if(a.isArr(this.__src__))return this.value(t);let e={};return e[this.key(t)]=this.value(t),e}asObject(){let t={};return this.loop((function(e,n,r){t[n]=e})),t}asArray(t=!1){return this.values(t)}filter(t,e=!1){let n=[];return this.loop((function(e,r,s){let i=t(e,r,s);if(!0===i)n.push(r);else if(null===i)return null}),e),this.keys=n,this}map(t,e=!1){let n=[];return this.loop((function(e,r,s){n.push(t(e,r,s))}),e),n}any(t){let e=!1;return this.loop((function(n,r,s){if(e=t(n,r,s),!0===e)return null})),e}all(t){let e=!0;return this.loop((function(n,r,s){if(e=t(n,r,s),!1===e)return null})),e}first(t){if(!t)return this.item(0);let e;return this.loop((function(n,r,s){if(!0===t(n,r,s))return e=s,null})),this.item(e)}last(t){if(!t)return this.item(this.count-1);let e;return this.loop((function(n,r,s){if(!0===t(n,r,s))return e=s,null}),!0),this.item(e)}}it={Queryable:at};var lt={};function ut(t){return t.toString().match(/{[\w\W]*}/)[0]}lt={funcBodyEquals:function(t,e){return ut(t)===ut(e)},throttle:function(t,e){var n=(new Date).getTime();return function(r){(new Date).getTime()-n>=e&&(n=(new Date).getTime(),t.call(this,r))}},debounce:function(t,e){var n=null;function r(e,n){t.apply(e,n)}return function(...t){clearTimeout(n),n=setTimeout(r,e,this,t)}}},i={...o,...W,...a,...Y,...Z,...it,...lt};var ct,ft,ht={};class dt{static split(t){return t.trim().replace(/\s+/," ").split(" ")}constructor(t){this.element=t,Object.defineProperty(this,"items",{get(){return this.classes},set(t){let e=!1;this.classes&&(e=!0),!a.isVal(t)||a.isEmpty(t)?this.classes=[]:a.isArr(t)?this.classes=t:a.isStr(t)?this.classes=dt.split(t):t instanceof DOMTokenList&&(this.classes=Array.from(t)),e&&this.__update__()}}),this.items=t.getAttribute("class")}static of(t){return new dt(t)}__update__(){this.element.setAttribute("class",this.classes.join(" "))}contains(...t){return t=o.flatMap(t),o.all(t,t=>o.contains(this.classes,t))}add(...t){t=o.flatMap(t),o.forEach(t,t=>{this.contains(t)||this.classes.push(t.toString())}),this.__update__()}remove(...t){t=o.flatMap(t);let e=this.classes.length;return this.classes=o.filter(this.classes,e=>!o.any(t,t=>t.endsWith("*")?e.startsWith(t.replace("*","")):e===t)),this.__update__(),e!==this.classes.length}toggle(...t){o.toggle(this.classes,t),this.__update__()}}Object.seal(dt),ft={Classes:dt,cls:function(t){return dt.of(t)},addClass:function(t,...e){dt.of(t).add(e)},hasClass:function(t,...e){dt.of(t).contains(e)},removeClass:function(t,...e){dt.of(t).remove(e)},toggleClass:function(t,...e){dt.of(t).toggle(e)}};const{cls:pt}=ft;function _t(t,e=document){return a.isEl(t)?Array.of(t):a.isEls(t)?t:a.isStr(t)?a.isEl(e)?Array.from(e.querySelectorAll(t)):(W.error(`Query root is not a node!\t[X.$(${t}, ${e})]`),null):(W.error(`Query is not string nor element X.$(${t})`),null)}ct={$:_t,$$:function(t,e=document){return a.isEl(t)?Array.of(t):a.isStr(t)?a.isEl(e)?Array.of(e.querySelector(t)):(W.error(`Query root is not a node!\t[X.$(${t}, ${e})]`),null):(W.error(`Query is not string nor element X.$$(${t})`),null)},queryOf:function t(e,n,r){if(!a.isVal(e)||!a.isEl(e))return W.error(`\nQuery generator's first parameter must be Element/Node! CAUSE: X.queryOf(${e}, ${n})`),null;n=n||document.body;let s=e.tagName;if(r=r||"",e.id)return s+=e.id?"#"+e.id:"",s+(""!==r?" "+r:"");if(pt(e).items.forEach((function(t){s+=""!==t?"."+t:""})),s){if(_t(s,e.parentElement).length>1){let t=Array.from(e.parentElement.children).findIndex((function(t){return e===t}));t>0&&(s=s+":nth-child("+(t+1)+")")}}return e.parentElement&&e.parentElement!==n&&e.parentElement!==document?t(e.parentElement)+" > "+s+(""!==r?" "+r:""):s+(""!==r?" "+r:"")}};var mt;mt={setEvent:function(t,n,r,s){e.isBrowser()?(a.isArr(n)||(n=o.contains(n," ")?n.split(" ").Map(t=>t.trim()):[n]),t.__EVENTS__=t.__EVENTS__||{},o.forEach(n,(function(e){t.__EVENTS__[e]=t.__EVENTS__[e]||[];let n=function(e){r(e,t)};a.hasField(s,"duplicates",t=>t)||(t.__EVENTS__[e]=o.filter(t.__EVENTS__[e],n=>{if(lt.funcBodyEquals(n.l,r))return t.removeEventListener(e,n.f,n.o),!1;console.log("notEqual",n.l.toString(),r.toString())})),t.__EVENTS__[e].push({f:n,l:r,o:s}),t.addEventListener(e,n,s)}))):W.error("Events are browser only!")},clearEvent:function(t,n){e.isBrowser()?(a.isArr(n)||(n=o.contains(n," ")?n.split(" ").Map(t=>t.trim()):[n]),t.__EVENTS__=t.__EVENTS__||{},a.isEmpty(t.__EVENTS__)||o.forEach(n,(function(e){t.__EVENTS__[e]=t.__EVENTS__[e]||[],a.isEmpty(t.__EVENTS__[e])||(o.forEach(t.__EVENTS__[e],n=>(t.removeEventListener(e,n.f,n.o),!1)),t.__EVENTS__[e]=[])}))):W.error("Events are browser only!")}};var gt;function yt(t){let e={};return o.forEach(t.getAttributeNames(),n=>e[n]=t.getAttribute(n)),e}function bt(t,e){return!!this.element.hasAttribute(t)&&(!e||this.element.getAttribute(t)===e)}function Et(t,e){return t.getAttribute(e)}function vt(t,e,n){a.isArr(e)?o.forEach(e,t=>this.set(t,n)):a.isObj(e)?o.forEach(e,(t,e)=>this.set(e,t)):t.setAttribute(e,n)}class Ct{constructor(t){this.element=t}keys(){return this.element.getAttributeNames()}all(){return yt(this.element)}set(t,e){return vt(this.element,t,e),this}get(t){return Et(this.element,t)}has(t,e){return bt(t,e)}remove(t){this.set(t,void 0)}}gt={getAttributes:yt,Attributes:Ct,getAttr:Et,hasAttr:bt,setAttr:vt,attrs:function(t){return new Ct(t)}};var Tt;const{cls:wt}=ft,{attrs:Ot}=gt;function xt(t){return t.offset}function At(t){return t.offsetWidth}Tt={left:xt,width:At,right:function(t){return xt(t)+At(t)}};var kt={};kt={append:function(t,...e){window.dispatchEvent(new CustomEvent("x.dom.append",{detail:{parent:t,elements:e}})),t.append(...e)}};var St;const{isVal:Lt,isObj:jt,isEl:Pt,hasField:qt}=a,{forEach:Nt}=o,{setAttr:Rt}=gt,{cls:$t}=ft,{error:Mt}=W;St={patch:function(t,e){if(Lt(t))if(Pt(t)){if(qt(e,"attr")&&jt(e.attr)&&Nt(e.attr,(e,n)=>{Rt(t,n,e)}),qt(e,"cls")&&jt(e.cls)){let n=$t(t);Nt(e.cls,(t,e)=>{n[e](t)})}qt(e,"prop")&&jt(e.prop)&&Nt(e.prop,(e,n)=>{t[n]=e})}else Mt(`"${t}" is not Element or Node`);else Mt("Node is "+t)}};var Vt;const{isUnd:Dt,isStr:Ut}=a,{filter:Ht,forEach:Ft,contains:Xt}=o,It=["","initial","unset",void 0,null];function Bt(t,e,n){if(Dt(e)){let e=getComputedStyle(t);return e=Ht(e,(t,e)=>Ut(e)&&!Xt(It,t)),e}if(Dt(n))return t.style[e]||getComputedStyle(t)[e];t.style[e]=n}Vt={style:Bt,hasStyle:function(t,e){let n=Bt(t,e);return!Xt(It,n)}},ht={...ct,...mt,...ft,...gt,...Tt,...kt,...St,...Vt};var Wt,Kt;function zt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}const{$:Gt,$$:Qt}=ct;class Jt{constructor(t,e){zt(this,"type",void 0),zt(this,"data",void 0),this.type=t,this.data=e}}Kt={HttpContent:Jt,HttpRq:class{setMethod(t){this.method=t.toUpperCase()}setUrl(t){this.url=encodeURI(t)}setArg(t,e){this.args[t]=e}buildUrlEncoded(t){let e="";t=t||this.args;let n=Object.keys(t);if(n.length>0)for(let r=0;r<n.length;r++)e+=encodeURIComponent(n[r])+"="+encodeURIComponent(t[n[r]]),r<n.length-1&&(e+="&");return e}setHeader(t,e){this.headers[t]=e.toString()}getHeader(t){return this.headers[t]}setContent(t,e){this.content.type=t.toLowerCase(),this.content.data=e}jsonContent(t){let e="";e="string"==typeof t?t:JSON.stringify(t),this.setContent("json",e),this.setHeader("Content-Type","application/json")}xmlContent(t){a.isStr(t)?this.setContent("xml",t):this.setContent("xml",t.outerHTML),this.setHeader("Content-Type","application/xml")}formContent(t){let e=Qt(t)[0],n=new FormData(e);this.formMultiPartContent(n)}formMultiPartContent(t){this.setContent("form_multipart",t)}formUrlEncodedContent(t){this.setContent("form_urlencoded",this.buildUrlEncoded(t)),this.setHeader("Content-Type","application/x-www-form-urlencoded")}constructor(t="GET",e,n,r,s){this.args=n||{},this.headers=r||{},this.content=s||new Jt("#urlencoded",{}),this.setMethod(t),this.setUrl(e)}}};var Yt;function Zt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Yt={HttpRs:class{constructor(t){Zt(this,"json",void 0),Zt(this,"xml",void 0),this.xhr=t,this.status={code:t.status,text:t.statusText},this.headers=t.getAllResponseHeaders(),this.contentLength=t.response.length||0,this.data=t.response,"text"!==t.responseType&&""!==t.responseType||(this.text=t.responseText),Object.defineProperty(this,"json",{get(){try{t.responseJSON||(t.responseJSON=JSON.parse(this.xhr.responseText))}catch(t){console.log(t)}return t.responseJSON}}),Object.defineProperty(this,"xml",{get(){try{if(!t.responseXML&&!t.responseXml){let e=new DOMParser;t.responseXml=e.parseFromString(self.text,"text/xml")}}catch(t){console.log(t)}return t.responseXml}})}}};var te;function ee(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}const{HttpRq:ne,HttpContent:re}=Kt,{HttpRs:se}=Yt,{forEach:ie}=o;te={Ajax:class{constructor(t,e,n={},r={},s=new re){ee(this,"rq",{}),ee(this,"rs",{}),this.rq=t instanceof ne?t:new ne(t,e,n,r,s),this.rs={readyState:0},this.xhr=new XMLHttpRequest,this.preparedCallback=function(t){},this.progressCallback=function(t,e){},this.uploadProgressCallback=function(t){},this.successCallback=function(t,e){},this.uploadFinishCallback=function(t){},this.failCallback=function(t,e){},Object.defineProperty(this,"xhr",{enumerable:!1})}header(t,e){return this.rq.setHeader(t,e),this}headers(t={}){return ie(t,(t,e)=>{this.rq.setHeader(e,t)}),this}onSuccess(t){return this.successCallback=t,this}onUploadSuccess(t){return this.uploadFinishCallback=t,this}onFail(t){return this.failCallback=t,this}onProgress(t){return this.progressCallback=t,this}onUploadProgress(t){return this.uploadProgressCallback=t,this}withContent(t={}){switch(t.type){case"json":this.rq.jsonContent(t.data);break;case"xml":this.rq.xmlContent(t.data);break;case"form":this.rq.formContent(t.data);break;case"form_multipart":this.rq.formMultiPartContent(t.data);break;case"form_urlencoded":this.rq.formUrlEncodedContent(t.data);break;default:this.rq.setContent(t.type,t.data)}return this}xmlData(t){return this.rq.xmlContent(t),this}formData(t){return this.rq.formContent(t),this}jsonData(t){return this.rq.jsonContent(t),this}urlEncodedData(t){return this.rq.formUrlEncodedContent(t),this}_prepare(t){if(this.isPrepared&&!t)return this;let e=this.rq.url;this.rq.args&&!a.isEmpty(this.rq.args)&&(e.indexOf("?")>=0||(e+="?"),e+=this.rq.buildUrlEncoded()),t&&(this.xhr=new XMLHttpRequest),this.xhr.open(this.rq.method,e);for(let t in this.rq.headers)this.rq.headers.hasOwnProperty(t)&&this.xhr.setRequestHeader(t,this.rq.headers[t]);return this.isPrepared=!0,this.preparedCallback&&this.preparedCallback(this.rq),this}send(t){this._prepare();let e=this,n=this.xhr;this.xhr.onreadystatechange=function(r){if(4===n.readyState){let r;r=n.status>=200&&n.status<=399?e.successCallback:e.failCallback,e.rs=new se(n),t&&t(e.rq,e.rs,e.xhr),r&&r(e.rq,e.rs,e.xhr)}},this.xhr.onprogress=function(t){e.progressCallback&&e.progressCallback(t,e)},this.xhr.upload.onprogress=function(t){e.uploadProgressCallback&&e.uploadProgressCallback(t,e)},this.xhr.upload.onloadend=function(t){e.uploadFinishCallback&&e.uploadFinishCallback(t,e)};try{this.xhr.send(this.rq.content.data)}catch(t){this.onFail(t)}return e}async sendAsync(){const t=this,e=new Promise((e,n)=>{t.onSuccess(()=>e(t)),t.onFail(()=>n(t))});return t.send(),e}}};var oe={};const{Ajax:ae}=te,{HttpContent:le}=Kt;function ue(t,e,n,r,s,i){let o=new ae(t.toUpperCase(),e,n,r);return s&&s.type&&("json"===s.type.toLowerCase()?o.jsonData(s.data):"urlencoded"===s.type.toLowerCase()?o.urlEncodedData(s.data):"form"===s.type.toLowerCase()?o.formData(s.data):o.Rq.setContent(s.type,s.data)),i.success&&o.onSuccess(i.success),i.fail&&o.onFail(i.fail),i.progress&&o.onProgress(i.progress),i.prepare&&(o.preparedCallback=i.prepare),i.uploadProgress&&(o.uploadProgressCallback=i.uploadProgress),i.uploadFinish&&(o.uploadFinishCallback=i.uploadFinish),o}function ce(t){return ue(t.method||"OPTIONS",t.url,t.params,t.headers,new le(t.type,t.data),{success:t.success,fail:t.fail,progress:t.progress,prepare:t.prepare,uploadProgress:t.uploadProgress,uploadFinish:t.uploadFinish})}function fe(t,e=null,n=null){return new Promise((r,s)=>{t.onSuccess(()=>{if(e)try{e(n)}catch(t){}return r(t)}),t.onFail(()=>s(t))})}async function he(t){let e=ce(t);return e.send(t.finish),await fe(e)}oe={makeHttpRequest:ue,makeRequest:ce,makePromise:fe,sendRequest:he,Get:function(t,e){return new ae("GET",t,e)},Post:function(t,e){return new ae("POST",t,e)},Delete:function(t,e){return new ae("DELETE",t,e)},Put:function(t,e){return new ae("PUT",t,e)},Patch:function(t,e){return new ae("PATCH",t,e)},sendGet:function(t){return t.method="GET",t.type=void 0,t.data=void 0,he(t)},sendDelete:function(t){return t.method="DELETE",he(t)},sendPost:function(t){return t.method="POST",he(t)},sendPut:function(t){return t.method="PUT",he(t)},sendPatch:function(t){return t.method="PATCH",he(t)}};var de;function pe(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}const{startsWith:_e,endsWith:me,filter:ge,forEach:ye}=o;class be{constructor(){pe(this,"all",[])}use(t){this.all.push(t)}}de={XHttpClient:class{constructor(t="",{ratePerMinute:e=300}={}){pe(this,"host",""),pe(this,"__queue",[]),pe(this,"__sending",[]),pe(this,"__interval",void 0),pe(this,"__timeBetween",void 0),pe(this,"__ratePerMinute",void 0),pe(this,"__lastRequestTime",void 0),pe(this,"interceptors",{request:new be,response:new be}),me(t,"/")&&(t=t.split("").splice(t.length-1).join()),this.host=t,this.__ratePerMinute=e,this.__timeBetween=6e4/e,this.__lastRequestTime=(new Date).getTime()-this.__timeBetween}_intervalSend(t){if(0===t.__queue.length)return clearInterval(t.__interval),void(t.__interval=void 0);let e=(new Date).getTime();if(e-t.__lastRequestTime>t.__timeBetween){let n=t.__queue.pop().send();t.__sending.push(n),t.__lastRequestTime=e}}_addRequest(t,{responseType:e,cancelToken:n}){return this.__queue.push(t),this.__interval||(this.__interval=setInterval(this._intervalSend,1,this)),t.cancelToken=n,e&&(t.xhr.responseType=e),oe.makePromise(t,({client:t,request:e})=>{let n=t.__sending.indexOf(e);n>=0&&t.__sending.splice(n)},{client:this,request:t})}send(t){this._addRequest(t)}_contentRequest(t,e,{params:n,headers:r,content:s,responseType:i,cancelToken:o}){return!_e(e,"/")&&e.length>1&&(e="/"+e),this._addRequest(t(this.host+e,n||{}).headers(r||{}).withContent(s||{type:"",data:""}),{responseType:i,cancelToken:o})}get(t,{params:e,headers:n,responseType:r,cancelToken:s}={}){return!_e(t,"/")&&t.length>1&&(t="/"+t),this._addRequest(oe.Get(this.host+t,e).headers(n),{responseType:r,cancelToken:s})}post(t,{params:e,headers:n,content:r,responseType:s,cancelToken:i}={}){return this._contentRequest(oe.Post,t,{params:e,headers:n,content:r,responseType:s,cancelToken:i})}put(t,{params:e,headers:n,content:r,responseType:s,cancelToken:i}={}){return this._contentRequest(oe.Put,t,{params:e,headers:n,content:r,responseType:s,cancelToken:i})}patch(t,{params:e,headers:n,content:r,responseType:s,cancelToken:i}={}){return this._contentRequest(oe.Patch,t,{params:e,headers:n,content:r,responseType:s,cancelToken:i})}delete(t,{params:e,headers:n,content:r,responseType:s,cancelToken:i}={}){return this._contentRequest(oe.Delete,t,{params:e,headers:n,content:r,responseType:s,cancelToken:i})}cancel(t){this.__queue=ge(this.__queue,e=>e.cancelToken!==t);let e=ge(this.__sending,e=>e.cancelToken===t);ye(e,t=>{try{t.xhr.abort()}catch(t){console.log(t)}}),this.__sending=ge(this.__sending,e=>e.cancelToken!==t)}}},Wt={...Kt,...Yt,...te,...oe,...de};var Ee={};class ve{constructor(){this.name="",this.state={},this.view=t=>""}static create({name:t,state:e,view:n}){let r=new ve;if(r.name=t,r.state=e,!a.isFun(n))throw`"Component.view" must be a function: \nComponent:${r} \nview:${n}`;r.view=n}}Ee={Component:ve};var Ce,Te={};const{contains:we}=o;Ce={parseQuery:function(t,e={}){let n={tag:("",""),id:null,classes:[]};t=t.trim();let r=we(t,"#"),s=we(t,".");if(s||r){let e=t.split("#");if(r&&(n.tag=e[0].toUpperCase(),s||(n.id=t.split("#")[1])),s){let t=(e.length>1?e[1]:e[0]).split(".");r?n.id=t[0]:n.tag=t[0].toUpperCase(),n.classes=t.slice(1),n.classes.length>0&&(n.hasClass=!0)}}else n.tag=t.toUpperCase();return""!==n.tag&&void 0!==n.tag||(n.tag="div"),n}};const{parseQuery:Oe}=Ce,{map:xe,flatMap:Ae}=o,{isStr:ke,isObj:Se,isFun:Le,isEmpty:je,isVal:Pe}=a;class qe{constructor(t="#text"){this.tag=t,this.id=void 0,this.text=void 0,this.element=void 0,this.attr={}}get isText(){return"#text"===this.tag}get $first(){return this.nodes[0]}get $text(){return this.isText?this.text:this.$first&&this.$first.isText?this.$first.text:void 0}set $text(t){this.isText?this.text=t:this.$text?this.$first.$text=t:this.text=t}static createRef(t,e){let n=new qe(!Pe(t.name)||je(t.name)?t.constructor.name:t.name);return n.target=t,n.isRef=!0,n.props=e,n}static create(t,e={attr:{},on:{}},...n){if(null===e&&(e={attr:{},on:{}}),Le(t)||Se(t))return qe.createRef(t,e);n=Ae(n),n=xe(n,t=>ke(t)?qe.createText(t):t);let r=Oe(t),s=new qe(r.tag);return s.id=r.id,s.attr=e.attr||{},e.style&&(s.attr.style=e.style),!s.attr.class&&r.hasClass&&(s.attr.class=r.classes.join(" ")),s.nodes=n,s}static createText(t){let e=new qe;return e.text=t,e}}Te={VNode:qe};var Ne;const{warn:Re}=W,{first:$e,forEach:Me}=o;function Ve(t){let e=Array.from(t.children);return Me(e,t=>{t.remove()}),e}Ne={detachChildren:Ve,replaceChildren:function(t,e){Ve(t),t.append(e)},replaceFirstChild:function(t,e){if(0===t.children.length)return t.append(e);if(t.children.length>0){Re("Root is not empty");let n=Ve(t);n[0].__X_VDOM__?n[0]=e:(n=n.reverse().push(e),n=n.reverse()),t.append(...n)}}};var De={};function Ue(t,e={}){if(Ee.Component.isPrototypeOf(t)){t=Object.create(t.prototype).view(e)}else a.hasField(t,"view")?t=t.view(e):a.isFun(t)?t=t(e):a.isStr(t)&&(t=Te.VNode.createText(t));if(!0===t.isRef&&(t=Ue(t.target,t.props)),!(t instanceof Te.VNode))throw console.log("ILL",t),Error(`Illegal value "${t}", not supported in VirtualDOM tree`);return t.nodes&&(t.nodes=o.map(t.nodes,(function(t,e){return Ue(t)}))),t}function He(t,e={}){if("#text"===t.tag){let e=document.createTextNode(t.text);return t.element=e,e.__X_VDOM__=t,e}let n=document.createElement(t.tag);return t.id&&(n.id=t.id),t.attr&&o.forEach(t.attr,(function(t,e,r){if("style"!==e||a.isStr(t))"class"===e&&a.isArr(t)?n.setAttribute(e,t.join(" ")):"className"===e?n.className=t:n.setAttribute(e,t);else{let r="";o.forEach(t,(t,e)=>{r+=`${Y.kebab(e)}: ${t};`}),n.setAttribute(e,r)}})),o.forEach(t.nodes,(function(t){kt.append(n,He(t))})),t.element=n,n.__X_VDOM__=t,n}De={createDom:He,createVDom:Ue,render:function(t,e){return He(Ue(t,e))}};var Fe;Fe={mount:function(t,e,n=!1){if((t=ht.$$(t)[0]).__X_VDOM__&&!n)return void console.log("must patch",e);t.__X_VDOM__=!0,console.log(t);let r=De.render(e,{});t.append(r)},VNode:Te.VNode,Component:Ee.Component};const Xe={...Ee,...Te,...Ne,...De,...Fe};s={Core:i,Dom:ht,Http:Wt,VM:Xe},e.setGlobal({X:{...s.Core,...s.Dom,...s.Http},VM:{...s.VM}})}();
//# sourceMappingURL=exir-bundle.js.map