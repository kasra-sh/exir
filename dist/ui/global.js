!function(){var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},e={},n={};function r(t){return null!==t&&void 0===t}function o(t){return null===t}function i(t){return!r(t)&&!o(t)}function s(t){return"function"==typeof t}function u(t){return null!==t&&"object"==typeof t}function c(t,e,n){return!!i(t)&&(s(n)?n(t[e]):t.hasOwnProperty(e))}n={typeName:function(t){return t.hasOwnProperty("constructor")?t.constructor.name:typeof t},isUnd:r,isNull:o,isVal:i,isNum:function(t){return"number"==typeof t},isStr:function(t){return"string"==typeof t||t instanceof String},isFun:s,isObj:u,isArr:function(t){return t instanceof Array},isPrim:function(t){return i(t)&&!u(t)&&!s(t)||"symbol"==typeof t},isList:function(t){return i(t.length)&&s(t.item)},isMutableList:function(t){return i(t.length)&&s(t.item)&&s(t.add)},isSet:function(t){return t instanceof Set},isMap:function(t){return t instanceof Map},isError:function(t){return t instanceof Error},isEl:function(t){return t instanceof Element||t instanceof HTMLElement||t instanceof Node},isEls:function(t){return t instanceof HTMLCollection||t instanceof NodeList},hasField:c,isEmpty:function(t){return c(t,"length")?t.length<=0:!s(t)&&(!u(t)||Object.keys(t).length<=0)},Enum:function(t){let e=0,n={};for(let r of Object.keys(t))n[n[e]=r]=e++;return n},dict:function(...t){let e={};for(let n=0;n<t.length;n++)n%2==0&&(e[t[n]]=t[n+1]);return e}},t._X_LOOP_BREAK_||(t._X_LOOP_BREAK_=Symbol("BREAK_LOOP"),t._X_ANY_=Symbol("ANY"),t._X_ALL_=Symbol("ALL"));const l=t._X_LOOP_BREAK_,f=t._X_ANY_,a=t._X_ALL_,h=["__proto__","constructor","__defineGetter__","__defineSetter__","prototype"];function p(t,e){if(n.isVal(t))return n.isObj(t)||n.isStr(t)||n.isArr(t)?t[e]:t.item(e)}function d(t,e,r){return!!n.isVal(t)&&(!n.isArr(t)&&n.isObj(t)?t[r]===e:t.indexOf(e)>=0)}function $(t,...e){n.isArr(t)?w(e,(e=>t.push(e))):n.isMutableList(t)&&t.add(e)}function m(t,...e){e=M(e);let n=!1;return w(e,(e=>{let r=t.indexOf(e);r>=0&&(n=!0,t.splice(r,1))})),n}function y(t,e){let n=Object.keys(e);for(let r of n){if(e[r]===f&&t.hasOwnProperty(r))return!0;if(e[r]===t[r])return!0}return!1}function _(t,e){let n=Object.keys(e);for(let r of n)if(e[r]!==f&&e[r]!==t[r])return!1;return!0}function g(t,e=(()=>!0),r=!0){return n.isUnd(t)?e:n.isFun(t)?t:t instanceof RegExp?(e,r,o,i)=>!n.isObj(e)&&t.test(e.toString()):n.isObj(t)?0===Object.keys(t).length?e:r?(e,n,r,o)=>y(e,t):(e,n,r,o)=>_(e,t):(e,n,r,o)=>e===t}function E(t){if(n.isUnd(t))return t=>t;if(n.isFun(t))return t;if(n.isStr(t)){const e=t;t=t=>t[e]}throw Error(`Predicate ${t} cannot be of type ${typeof t}`)}function v(t,e={}){return n.isStr(t)?"":n.isList(t)||n.isArr(t)?[]:n.isObj(t)?n.isEl(t)?3===t.nodeType||8===t.nodeType?document.createTextNode(t.textContent):document.createElement(t.tagName):t.__proto__?Object.create(t.__proto__):{}:e}function b(t,e,r=!1){if(n.isStr(t))return t.concat(e);if(n.isArr(t))return t.concat(e);for(let n of Object.keys(e))t[n]&&!r||(t[n]=e[n]);return t}function w(t,e){if(!n.isVal(t))return-1;if(!n.isArr(t)||!n.isStr(t)||!n.isList(t)){let n=0,r=Object.keys(t);const o=r.length;for(;n<o;n++){const o=r[n];if(e(t[o],o,n,t)===l)return n}return n}const r=t.length;if(n.isArr(t))for(let n=0;n<r;n++){if(e(p(t,n),n,n,t)===l)return n}else for(let n=0;n<r;n++){if(e(t[n],n,n,t)===l)return n}return t.length}function A(t,e,r=[]){if(!n.isArr(t)||!n.isStr(t)){let n=0,o=Object.keys(t);for(let n=o.length-1;n>=0;n--){if(n<r[1])continue;if(n>=r[0])return n;if(e(t[o[n]],o[n],n,t)===l)return n}return n}for(let n=t.length-1;n>=0;n--){if(e(p(t,n),n,n,t)===l)return n}return t.length}function O(t,e){e=g(e,(()=>!0));let n=-1;return w(t,(function(r,o,i){if(n=e(r,o,i,t),!0===n)return n=i,l})),n}function S(t,e){return p(t,O(t,e))}function x(t,e){e=g(e,(()=>!0));let n=-1;return A(t,(function(t,r,o){if(n=e(t,r,o),!0===n)return n=o,l})),n}function N(t,e){return t[x(t,e)]}function L(t,e){let n=g(e),r=!1;return w(t,(function(t,e,o,i){if(r=n(t,e,o,i),!0===r)return l})),r}function T(t,e){e=g(e,(()=>!0));let n=!0;return w(t,(function(t,r,o,i){if(n=e(t,r,o,i),!1===n)return l})),n}function j(t,e,n=!1,r=!1){e=g(e,(()=>!0));let o="";return(n?A:w)(t,(function(n,i,s){e&&e(n,i,s,t)!==r||(o+=n)})),o}function k(t,e,r=!1,o=!1){if(n.isArr(e)){let t=Object.assign({},e);e=o?(e,n)=>!L(t,n):(e,n)=>L(t,n)}else e=g(e,(()=>!0));let i={};const s=Object.keys(t),u=s.length;if(r)for(let n=u-1;n>=0;n--){const r=s[n],u=t[r];e(u,r,n,t)!==o&&(i[r]=u)}else for(let n=0;n<u;n++){const r=s[n],u=t[r];e(u,r,n,t)!==o&&(i[r]=u)}return i}function C(t,e,r=!1,o=!1){if(n.isArr(e)){let t=Object.assign([],e);e=o?(e,n,r)=>!L(t,r):(e,n,r)=>L(t,r)}else e=g(e,(()=>!0));let i=[];const s=t.length;if(r)for(let n=s-1;n>=0;n--){const r=t[n];!e(r,n,n,t)!==o&&i.push(r)}else for(let n=0;n<s;n++){const r=t[n];e(r,n,n,t)!==o&&i.push(r)}return i}function V(t,e,r=!1){return n.isStr(t)?j(t,e,r):n.isArr(t)||n.isList(t)?C(t,e,r):k(t,e,r)}function R(t,e){let n;e=E(e);let r=-1;return w(t,(function(t,o){let i=e(t,o);n?i>=n&&(n=i,r=o):(n=i,r=o)})),r}function D(t,e){let n;e=E(e);let r=-1;return w(t,(function(t,o){let i=e(t,o);n?i<=n&&(n=i,r=o):(n=i,r=o)})),r}function I(t,e,r=!1){return e=g(e,(t=>t)),n.isArr(t)?function(t,e,r=!1){let o=[];const i=t.length;if(r)for(let r=i;r>=0;r--){let i=e(t[r],r,t);if(i===l)break;n.isUnd(i)||o.push(i)}else for(let r=0;r<i;r++){let i=e(t[r],r,t);if(i===l)break;n.isUnd(i)||o.push(i)}return o}(t,e,r):n.isObj(t)?function(t,e,r=!1){let o={};const i=Object.keys(t),s=t.length;if(r)for(let r=s;r>=0;r--){const s=i[r];let u=e(t[s],s,r,t);if(u===l)break;n.isUnd(u)||(o[s]=u)}else for(let r=0;r<s;r++){const s=i[r];let u=e(t[s],s,r,t);if(u===l)break;n.isUnd(u)||(o[s]=u)}return o}(t,e,r):void 0}function M(t,e){let r;return r=n.isStr(t)?"":n.isArr(t)?[]:{},w(t,(function(o,i){let s;e?s=e(o,i,t):!n.isArr(r)&&n.isObj(r)?(s={},s[i]=o):s=o,r=b(r,s)})),r}function U(t,e,r=t){return n.isUnd(e)&&(e=(t,e)=>t+e),w(t,((t,n,o)=>{r=e(r,t,n,o)})),r}function F(t,e,{excludeKeys:r=[],maxDepth:o=999,allowUnsafeProps:i=!1}={excludeKeys:[],maxDepth:999,allowUnsafeProps:!1},s=0){return s>=o||w(e,((u,c)=>{r&&d(r,c)||i&&d(h,c)||(n.isObj(e[c])?t[c]=F(v(e[c]),e[c],{excludeKeys:r,maxDepth:o,depth:s+1}):t[c]=u)})),t}function P(t,e){let r=t;if(n.isStr(t))r=e=>e[t];else if(n.isArr(t))r=e=>U(e,((e,n,r)=>{if(d(t,r))return e+n}),"");else if(!n.isFun(t))throw Error(`${e} key only accepts: String, [String,...], Function`);return r}e={ANY:f,ALL:a,BREAK:l,item:p,contains:d,add:$,remove:m,toggle:function(t,...e){if(0===e.length)return;let n;if(1===(e=M(e)).length)m(t,e)||$(t,e[0]);else{e.push(e[0]);let r=!1;w(t,((o,i)=>{n=e.indexOf(o),n>=0&&e.length>n+1&&(r=!0,t[i]=e[n+1])})),r||t.push(e[0])}},concat:b,emptyOf:v,objMatchOne:y,objMatchAll:_,deepMerge:F,deepClone:function(t,{excludeKeys:e=[],maxDepth:n=999,allowUnsafeProps:r=!1}={excludeKeys:[],maxDepth:999,allowUnsafeProps:!1}){return F(v(t),t,{excludeKeys:e,maxDepth:n,allowUnsafeProps:r})},forN:function(t,e=0,n=0,r=(e<n?1:-1)){if(r>0)for(;e<=n;e+=r)t(e);for(;e>=n;e+=r)t(e)},forEachRange:function(t,e,r=0,o){if(!n.isArr(t)||!n.isStr(t)){let n=Object.keys(t);o=o||n.length-1;for(let i=r;i<=o;i++){if(e(t[n[i]],n[i],i,t)===l)return i}return o}o=o||t.length;for(let n=r;n<o;n++){if(e(p(t,n),n,n,t)===l)return n}return o},forEach:w,forEachRight:A,firstIndex:O,first:S,startsWith:function(t,e){return n.isStr(t)&&n.isStr(e)?0===t.indexOf(e):(e=g(e,(()=>!0)))(S(t))},lastIndex:x,last:N,endsWith:function(t,e){return n.isStr(t)&&n.isStr(e)?t.indexOf(e)===t.length-e.length:(e=g(e,(()=>!0)))(N(t))},reverse:function(t){if(n.isArr(t))return t.reverse();let e="";return A(t,(function(t){e+=t})),e},any:L,all:T,filter:V,filterRight:function(t,e){return V(t,e,!0)},reduce:U,reduceRight:function(t,e,n=t){A(t,((t,r,o)=>{n=e(n,t,r,o)}))},map:I,flatMap:M,keyValuePairs:function(t){let e=[];return w(t,((t,r)=>{e.push(n.dict(r,t))})),e},entries:function(t){let e=[];return w(t,((t,n)=>{e.push([n,t])})),e},maxIndex:R,max:function(t,e){return t[R(t,e)]},minIndex:D,min:function(t,e){return t[D(t,e)]},shuffle:function(t){return Array.prototype.sort.call(t,(()=>Math.random()-.5))},sortAsc:function(t,e,n="en"){let r=e?function(t,r){return(""+e(t)).localeCompare(""+e(r),n)}:void 0;return Array.prototype.sort.call(t,r)},sortDesc:function(t,e,n="en"){let r=e?function(t,r){return(""+e(r)).localeCompare(""+e(t),n)}:void 0;return Array.prototype.sort.call(t,r)},translateObject:function(t,e){n.isArr(e)&&V(t,e);const r=Object.keys(e);let o=V(t,r);for(let t of r)o[e[t]]=o[t],delete o[t];return o},omit:function(t,e,r=!1){return n.isStr(t)?j(t,e,r,!0):n.isArr(t)||n.isList(t)?C(t,e,r,!0):k(t,e,r,!0)},join:function(t,...e){if(0===e.length)return[];if(!T(e,n.isArr))throw Error("Join only accepts arrays of data!");let r=P(t,"Join");const o={};return w(e,(t=>{w(t,(t=>{const e=r(t),n=o[e];o[e]=n?b(n,t):t}))})),o},groupBy:function(t,...e){if(0===e.length)return{};if(!T(e,n.isArr))throw Error("GroupBy only accepts arrays of data!");let r=P(t,"GroupBy");const o={};return w(e,(t=>{w(t,(t=>{const e=r(t),n=o[e];o[e]=n?b(n,t):[t]}))})),o},objectValues:function(t){return Object.values?Object.values(t):I(t,(t=>t))}};var B={},W={};function K(t){return`[${t}] [${function(){let t=new Date;return`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}:${t.getMilliseconds()}`}()}]`}function z(t,e){t.reverse(),t.push("display: inline-block; font-weight: bold; color: black","%c"+e),t.reverse()}const H={TRACE:0,INFO:1,WARN:2,ERROR:3,SILENT:-1},q={LogLevel:H.TRACE};function X(t){return q.LogLevel!==H.SILENT&&q.LogLevel<=t}W={Config:q,LogLevels:H,showTrace:function(){q.LogLevel=H.TRACE},showInfo:function(){q.LogLevel=H.INFO},showWarn:function(){q.LogLevel=H.WARN},showError:function(){q.LogLevel=H.ERROR},silent:function(){q.LogLevel=H.SILENT},trace:function(...t){X(H.TRACE)&&(t.reverse(),t.push(K("🔍 TRACE")),t.reverse(),console.trace.apply(this,t))},info:function(...t){X(H.INFO)&&(z(t,K("🔵 INFO")),console.log.apply(this,t))},warn:function(...t){X(H.WARN)&&(z(t,K("🚨 WARN")),console.warn.apply(this,t))},error:function(...t){X(H.ERROR)&&(z(t,K("💥 ERROR")),console.error.apply(this,t))}};var G;G={kebab:function(t){let e="",n=!1;for(let r=0;r<t.length;r++){let o=t.charAt(r);"_"!==o?(o>="A"&&o<="Z"&&r>0&&!n&&(e+="-"),e+=o.toLowerCase(),n=!1):(e+="-",n=!0)}return e},camel:function(t){let e="",n=!1;for(let r=0;r<t.length;r++){let o=t.charAt(r);"-"===o||"_"===o?n=!0:!0===n?(e+=o.toUpperCase(),n=!1):e+=0===r?o.toLowerCase():o}return e},pascal:function(t){let e="",n=!1;for(let r=0;r<t.length;r++){let o=t.charAt(r);"-"===o||"_"===o?n=!0:!0===n?(e+=o.toUpperCase(),n=!1):e+=0===r?o.toUpperCase():o}return e},snake:function(t){let e="",n=!1;for(let r=0;r<t.length;r++){let o=t.charAt(r);"-"!==o?(o>="A"&&o<="Z"&&r>0&&!n&&(e+="_"),e+=o.toLowerCase(),n=!1):(e+="_",n=!0)}return e}};var Y;const Z=/^[-+]?\d*(\.\d+|\d*)(e[-+]?\d+)?$/,J=/^[-+]?[a-f0-9]+$/,Q=/^[-+]?[0][0-7]+$/,tt=/^[-+]?[01]+$/,et=/^[a-z0-9]([a-z0-9._%-+][a-z0-9]|[a-z0-9])*@[a-z0-9]([a-z0-9.-][a-z0-9]|[a-z0-9])*\.[a-z]{2,6}$/i;Y={isDecimal:function(t){return Z.test(t)},isHex:function(t){return J.test(t)},isOctal:function(t){return Q.test(t)},isBinary:function(t){return tt.test(t)},isEmail:function(t){return et.test(t)},startsWith:function(t,e){return 0===t.indexOf(e)},endsWith:function(t,e){return t.indexOf(e)===e.length-1},contains:function(t,e){return t.indexOf(e)>=0}};var nt;class rt{constructor(){this.__src__=void 0,this.keys=void 0}get count(){return this.keys.length}static of(t){let e=new rt;return e.__src__=t,e.keys=Object.keys(t),e.len=e.keys.length,e}slice(t=0,e=this.count-1){this.keys=this.keys.slice(t,e)}key(t=0){return this.keys[t]}value(t=0){return this.__src__[this.key(t)]}loop(t,e=!1){if(e)for(let e=this.count-1;e>=0&&null!==t(this.value(e),this.key(e),e);e--);else for(let e=0;e<this.count&&null!==t(this.value(e),this.key(e),e);e++);return this}values(t=!1){let e=[];return this.loop((function(t,n,r){e.push(t)}),t),e}item(t){if(void 0===t)return;if(n.isArr(this.__src__))return this.value(t);let e={};return e[this.key(t)]=this.value(t),e}asObject(){let t={};return this.loop((function(e,n,r){t[n]=e})),t}asArray(t=!1){return this.values(t)}filter(t,e=!1){let n=[];return this.loop((function(e,r,o){let i=t(e,r,o);if(!0===i)n.push(r);else if(null===i)return null}),e),this.keys=n,this}map(t,e=!1){let n=[];return this.loop((function(e,r,o){n.push(t(e,r,o))}),e),n}any(t){let e=!1;return this.loop((function(n,r,o){if(e=t(n,r,o),!0===e)return null})),e}all(t){let e=!0;return this.loop((function(n,r,o){if(e=t(n,r,o),!1===e)return null})),e}first(t){if(!t)return this.item(0);let e;return this.loop((function(n,r,o){if(!0===t(n,r,o))return e=o,null})),this.item(e)}last(t){if(!t)return this.item(this.count-1);let e;return this.loop((function(n,r,o){if(!0===t(n,r,o))return e=o,null}),!0),this.item(e)}}nt={Queryable:rt};var ot={};function it(t){let e=t.toString().match(/{[\w\W]*}/);return null===e?t.toString():e[0]}ot={funcBodyEquals:function(t,e){return it(t)===it(e)},throttle:function(t,e){var n=(new Date).getTime();return function(r){(new Date).getTime()-n>=e&&(n=(new Date).getTime(),t.call(this,r))}},debounce:function(t,e){var n=null;function r(...r){clearTimeout(n),n=setTimeout((function(e){return t.apply(e,r)}),e,this)}return r.flush=function(...e){return clearTimeout(n),t.apply(this,e)},r},bindArgs:function(t,e){return function(){return t.apply(this,e)}},once:function(t){var e=!1;return function(){if(!e)return e=!0,t.apply(this,arguments)}}},B={...e,...W,...n,...G,...Y,...nt,...ot};var st;const{kebab:ut}=G,{forEach:ct}=e;function lt(t){let e=[];return ct(t,((t,n)=>{e.push(`${ut(n)}: ${t};`)})),e}st={generateStyles:lt,generateCss:function(t,e="\n"){return lt(t).sort(((t,e)=>t[0].localeCompare(e[0]))).join(e)}};var ft={},at={};function ht(){return void 0!==t.window&&void 0!==t.document&&void 0!==t.navigator}ht()||(t.HTMLElement=t.HTMLElement?t.HTMLElement:function(){},t.Element=t.Element?t.Element:function(){},t.Node=t.Node?t.Node:function(){},t.HTMLCollection=t.HTMLCollection?t.HTMLCollection:function(){},t.NodeList=t.NodeList?t.NodeList:function(){}),at={setGlobal:function(e){for(let n of Object.keys(e))t[n]=e[n]},Extension:class{constructor(t){this.types=t,this.types=[],this.pcode="\n"}define(t){if(!t.name){let e=`Function must have a name [Extension.define(f)]\n<<${t}>>`;return console.error(e),`\n/**\n *${e}\n */`}let e="\n";for(let n of this.types)void 0!==n&&(e+=`${n.name||n}.prototype.${t.name} = `);return e+=t.toString()+";\n",this.pcode+=e,e}polyfill(t){if(!t.name){let e=`Extension function must have a name:\n<<${t}>>`;return console.error(e),`\n/**\n *${e}\n */`}let e="\n";for(let n of this.types)e+=`if (${n.name||n}.prototype.${t.name} === undefined) ${n.name||n}.prototype.${t.name} = ${t.toString()};\n`;this.pcode+=e}},isBrowser:ht};const{isArr:pt,hasField:dt,isEmpty:$t}=n,{contains:mt,forEach:yt,filter:_t}=e,{error:gt}=W,{funcBodyEquals:Et}=ot;function vt(t,e,n){const r=Object.keys(t),o=Object.keys(e),i=Object.keys(t);for(let r of i){const o=t[r],i=e[r];if("style"===r){const t=Rt(o," ");t!==Rt(i," ")&&n.setAttribute("style",t)}else"className"===r?n.setAttribute("class",o):n.setAttribute(r,o)}for(let t of o)r.indexOf(t)<0&&n.removeAttribute(t)}function bt(t={},n={},r){e.forEach(n,(function(e,n){t[n]!==e&&ft.clearEvent(r,n)})),e.forEach(t,(function(t,e){ft.setEvent(r,e,t)}))}ft={setEvent:function(t,e,n,r){at.isBrowser()?(pt(e)||(e=mt(e," ")?e.split(" ").Map((t=>t.trim())):[e]),t.__EVENTS__=t.__EVENTS__||{},yt(e,(e=>{t.__EVENTS__[e]=t.__EVENTS__[e]||[];let o=function(e){n(e,t)};dt(r,"duplicates",(t=>t))||(t.__EVENTS__[e]=_t(t.__EVENTS__[e],(r=>{if(Et(r.l,n))return t.removeEventListener(e,r.f,r.o),!1}))),t.__EVENTS__[e].push({f:o,l:n,o:r}),t.addEventListener(e,o,r)}))):gt("Events are browser only!")},clearEvent:function(t,e){at.isBrowser()?(pt(e)||(e=mt(e," ")?e.split(" ").Map((t=>t.trim())):[e]),t.__EVENTS__=t.__EVENTS__||{},$t(t.__EVENTS__)||yt(e,(function(e){t.__EVENTS__[e]=t.__EVENTS__[e]||[],$t(t.__EVENTS__[e])||(yt(t.__EVENTS__[e],(n=>(t.removeEventListener(e,n.f,n.o),!1))),t.__EVENTS__[e]=[])}))):gt("Events are browser only!")},hasEvent:function(t,e){return t.__EVENTS__&&t.__EVENTS__[e]&&!$t(t.__EVENTS__[e])}};var wt,At=(wt=st)&&wt.__esModule?wt.default:wt;function Ot(t,r,o){r.attrs&&e.forEach(r.attrs,((e,r)=>{var o,i;"style"===r?(o=e,i=" ",e=n.isVal(o)?n.isStr(o)?o:n.isArr(o)?o.join(i):At.generateCss(o,i):""):"className"===r&&(r="class"),t.setAttribute(r,e)})),r.events&&e.forEach(r.events,((e,n)=>{o&&(e=e.bind(o)),ft.setEvent(t,n,e)}))}function St(t,e){let n=[];for(let r=0;r<t.$count;r++){const o=t.$nodes[r];if(o.$isText)n.push(Nt(o));else{let r;if(o.$raw&&o.$render(o,o.$view),o.$isView)o.$dispatchLifeCycle("onCreate",o.props),r=xt(o,t.$element||e),o.$dispatchLifeCycle("onMount",o.props);else{if(!o.$isNode)throw W.error("Illegal node",o),Error("Illegal child node");r=Lt(o)}r instanceof Array?r.forEach((t=>n.push(t))):n.push(r)}}return n}function xt(t,e,n=!1){t.$raw&&t.$render(t.$parent,t.$view);let r=St(t,e),o=t.$parent?void 0:e;return t.$single&&(o=r[0]),o&&!t.$single&&(r.forEach((t=>o.append(t))),r=[o],o.__view__=t),t.$element=o,t.$rootElement=t.$rootElement||e||t.$parent&&t.$parent.$element||t.$parent&&t.$parent.$rootElement,t.$rootElement?(t.$element===e?W.info("Parent is the same element"):e?r.forEach((t=>e.append(t))):r.forEach((e=>t.$rootElement.append(e))),t.$rootElement.__view__=t):W.info("no root",t),t.$isDirty=!1,t.$element||r}function Nt(t){let e=document.createTextNode(t.$text);return t.$element=e,e.__node__=t,e}function Lt(t,e,n){let r;if(t||console.trace(t),t.$isText)return Nt(t);if(t.$isNode||t.$frag&&e){let o;n?(o=e.id,r=e):r=document.createElement(t.$tag),Ot(r,t,t.$view),o&&(r.id=o),r.__node__=t,t.$element=r;let i=St(t,r);try{i.forEach((t=>{try{r.append(t)}catch(e){console.error(t,e)}}))}catch(e){console.error(t,e)}return r}if(t instanceof Array&&(t=Mt.create(null,void 0,t)).$render(),t.$frag){if(e){return St(t,e).forEach((t=>{e.append(t)})),e}return W.warn("Rendering fragment without rootElement",t),St(t)}t.$dispatchLifeCycle("onCreate",t.props);let o=xt(t,e);return t.$dispatchLifeCycle("onMount",t.props),o}function Tt(t){let e=Dt(Ct.$callRender(t),t,t,!0);kt(t,e,t.$rootElement),Ct.$setNodes(t,e,!1),t.$isDirty=!1,t.$dispatchLifeCycle("onUpdate",t.props)}function jt(t){let e;if(t.$element)return t.$element;{let n=t.$nodes;for(let t=0;t<n.length;t++)e?n[t].$removeDom():(e=jt(n[t]),e&&(n[t].$element=void 0))}return e}function kt(t,e,n){let r,o=t.$isNode?t.$element:n,i=t.$nodes,s=e.length,u=t.$nodes.length,c=s>=u,l=c?u:s,f=0;for(;f<l;f++){let s=i[f],u=e[f];if(u.$isText)if(s.$isText&&!u.$element)s.$text!==u.$text&&(s.$element.textContent=u.$text),u.$element=s.$element;else{u.$element=document.createTextNode(u.$text);let t=jt(s);o.insertBefore(u.$element,t),t.remove()}else if(u.$isNode){if(s.$isNode&&s.$tag===u.$tag&&!u.$element)u.$element=s.$element,u.$element.__node__=u.$element,u.$view=s.$view,r=u.$element,vt(u.attrs,s.attrs,s.$element),bt(u.events,s.events,r),u.$element||W.error("Fatal: current node has no $element",s,u),kt(s,u.$nodes,s.$element);else{let t=r||jt(s);u.$element?W.warn("Do not store and reuse tags, instead generate them dynamically from state or other sources of data.",u.$element):u.$element=Lt(u,t),t?o.replaceChild(u.$element,t):n.append(u.$element)}r=u.$element}else{if(!u.$isView)throw W.trace("Unexpected node",u),Error("Illegal node");if(s.$isView&&s.$name===u.$name)e[f]=s,s.$parent=t,a=s,h=u.props,(!a.$isView||a.shouldUpdate(h))&&(s.$updateInstance(u.props,u.$children),Tt(s));else{u.$nodes=xt(u,n),jt(s).replaceWith(u.$element)}}}var a,h;if(c)if(s-f>50){let n=[];for(let r=f;r<s;r++){let o=Lt(e[r],t.$rootElement);n.push(o)}let r=document.createElement("slot");r.style.display="none",o.append(r),r.replaceWith.apply(r,n)}else for(let n=f;n<s;n++){let r=Lt(e[n],t.$rootElement);o.append(r)}if(u>s){let e=t.$nodes;for(let t=f;t<u;t++)e[t].$removeDom()}}function Ct(t={},n=t){this.$type=It.VIEW,this.$name=this.constructor.name,this.$isView=!0,this.$nodes=void 0,this.$isDirty=!0,this.$raw=!0,this.$constructor=n;let r=Object.getOwnPropertyNames(this.$constructor);for(let t=0;t<r.length;t++){const n=r[t];this.$constructor[n]instanceof Function?this[n]=this.$constructor[n]:this[n]=e.deepClone(this.$constructor[n])}Object.defineProperty(this,"$update",{value:ot.debounce((()=>{this.$isDirty=!0,window.requestAnimationFrame?requestAnimationFrame((()=>{Tt(this)})):Tt(this)}),20),enumerable:!1,configurable:!1,writable:!1})}function Vt(){return Date.now().toString(24).slice(2)+Math.random().toString(24).slice(6)}function Rt(t,e){return B.isVal(t)?B.isStr(t)?t:B.isArr(t)?t.join(e):At.generateCss(t,e):""}function Dt(t=[],e,n,r=!1){let o=[];t instanceof Array||(t=[t]);try{for(let i=0;i<t.length;i++){let s=t[i];if(B.isVal(s)||(s=""+s),B.isPrim(s)){let t=Mt.createText(s.toString());t.$parent=e,o.push(t)}else if(s.$isView)o.push(r?s.$render(e,s):s);else if(s.$frag&&(s=s.$nodes),s instanceof Array)for(let t=0;t<s.length;t++){let i=s[t];B.isVal(i)||(i=""+i),B.isPrim(i)?(i=Mt.createText(i.toString()),i.$parent=e):!i.$isView&&i instanceof Function&&(i=Ct.create(i.name,{render:i})),o.push(r?i.$render(e,n):i)}else!s.$isView&&s instanceof Function?(s=Ct.create(s.name,{render:s}),s.$parent=e):s.$isNode||(s=Mt.createText(""+s),s.$parent=e),o.push(r?s.$render(e,n):s)}return o}catch(t){return B.error(t),[]}}Ct.create=function(t,e){let n=new Ct(e);return e.render||console.warn("render method is not defined"),n.$name=t,n},Ct.prototype.$createInstance=function(t,e){const n=this.$constructor,r=this.$name;let o=new Ct(n,n);return o.$name=r,o.$instanceId=Vt(),Object.keys(o).forEach((t=>{o[t]instanceof Function&&(o[t]=o[t].bind(o))})),o.$useStateCount=0,o.$useStates=[],o.$updateInstance(t,e)},Ct.prototype.$updateInstance=function(t,n,r){return this.props||(this.props={}),t&&e.concat(this.props,t,!0),n&&(n=Dt(n,r,this,!1)),this.$children=n,this.$instanceId=Vt(),this},Ct.$callRender=function(t){return t.$useStateIndex=0,t.render.call(t,t.props)},Ct.prototype.$render=function(t,e,n=!0){if(n&&!this.$raw)return this;let r=Ct.$callRender(this);return 0===r.length&&(r=[Mt.create("slot",{})]),Ct.$setNodes(this,r,!0),this.$parent=t,this.$view=e,this.$raw=!1,this},Ct.$setNodes=function(t,e,n){0===e.length&&(e=[Mt.createTag("slot")]),t.$nodes=n?Dt(e,t,t,!0):e,t.$count=t.$nodes.length,(t.$empty=0===t.$count)||(t.$first=t.$nodes[0]),1===t.$count&&(t.$single=!0)},Ct.$shoudUpdateDefault=function(t,e){return t.$isDirty||!function(t={},e={}){const n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(let r of n)if(e[r]!==t[r])return!1;return!0}(t.props,e)},Ct.prototype.shouldUpdate=function(t){return Ct.$shoudUpdateDefault(this,t)},Ct.prototype.$childByRef=function(t){if(this.$element)return this.$element.querySelector(`[ref=${t}]`).__node__},Ct.prototype.$removeDom=function(t){this.$single&&(this.$element.remove(),t=!0),this.$nodes.forEach((e=>e.$removeDom(t))),this.$dispatchLifeCycle("onDestroy")},Ct.prototype.$renderDom=function(t,e){this.$parent=e,this.$rootElement=t;for(let e=0;e<this.$count;e++)t.append(this.$nodes[e].$renderDom())},Ct.prototype.$clone=function(t,n){let r=this.$createInstance(e.deepClone(this.props),this.$children.map((t=>t.$clone())));return r.$render(t,n||r)},Ct.prototype.$serialize=function(){return e.deepClone(this,{excludeKeys:["$parent","$first","$view","$element","$rootElement"]})},Ct.prototype.$dispatchLifeCycle=function(t,...e){let n=this[t];n instanceof Function&&setTimeout(n,1,...e)},Ct.prototype.setState=function(t){t instanceof Function&&(t=t.call(this,this.state)),n.isObj(t)&&e.concat(this.state,t,!0),this.$update()},Ct.prototype.useState=function(t){let e=this.$useStateIndex;return e===this.$useStateCount&&(this.$useStates.push(t),this.$useStateCount+=1),this.$useStateIndex+=1,[this.$useStates[e],t=>{this.$useStates[e]=t,this.$isDirty=!0,this.$update()}]},Ct.prototype.useEffect=function(t){this.onUpdate=t};const It={VNODE:0,VIEW:1,TEXT:2};function Mt(t,e={},n){if(this.$type=It.VNODE,this.$tag=t,null===t)this.$frag=!0;else{if("#text"===t)return this.$isText=!0,void(this.$text=e);this.$isNode=!0;let n=Mt.compileProps(e);this.events=n.events,this.attrs=n.attrs,this.$element=void 0}this.$raw=!0,this.$resetNodes(n)}Mt.create=function(t,e={},...n){return null===e&&(e={}),null===t?new Mt(t,e,n):t.$isView?t.$createInstance(e,n):t.prototype&&t.prototype instanceof Ct?(new t).$updateInstance(e,n):!t.$type&&t instanceof Function?Ct.create(t.name,{render:t}).$createInstance(e,n):Mt.createTag(t,e,n)},Mt.compileProps=function(t){const n={events:{},attrs:{}};return e.forEach(t,((t,e)=>{var r;/on[A-Z]+/.test(e)?n.events[(r=e,r.slice(2).toLowerCase())]=t:n.attrs[e]=t})),n},Mt.createText=function(t){return new Mt("#text",t)},Mt.createTag=function(t,e,n){return new Mt(t,e,n)},Mt.prototype.$render=function(t,e){this.$parent=t,this.$view=e;for(let t=0;t<this.$count;t++){let n=this.$nodes[t];if(n.$isText)n.$parent=this;else try{n=n.$render(this,e)}catch(t){console.error(t,n)}}return this.$raw=!1,this},Mt.prototype.$resetNodes=function(t){try{this.$nodes=Dt(t,this,this.$view,!1)}catch(t){console.log(t,this.$nodes)}this.$count=this.$nodes.length,(this.$empty=0===this.$count)?1===this.$count&&(this.$single=!0):this.$first=this.$nodes[0]},Mt.prototype.$removeDom=function(t){t||this.$element.remove(),this.$isText||this.$nodes.forEach((e=>e.$removeDom(t)))},Mt.prototype.$clone=function(t,n){return Mt.createTag(this.$tag,{attrs:e.deepClone(this.attrs),events:this.events},this.$nodes.map((t=>t.$clone(this,n)))).$render(t,n)};const Ut=Mt.create;var Ft={a:function(t,...e){return Ut("a",t,...e)},abbr:function(t,...e){return Ut("abbr",t,...e)},address:function(t,...e){return Ut("address",t,...e)},aside:function(t,...e){return Ut("aside",t,...e)},b:function(t,...e){return Ut("b",t,...e)},bdi:function(t,...e){return Ut("bdi",t,...e)},bdo:function(t,...e){return Ut("bdo",t,...e)},blockquote:function(t,...e){return Ut("blockquote",t,...e)},br:function(t,...e){return Ut("br",t,...e)},button:function(t,...e){return Ut("button",t,...e)},caption:function(t,...e){return Ut("caption",t,...e)},code:function(t,...e){return Ut("code",t,...e)},col:function(t,...e){return Ut("col",t,...e)},colgroup:function(t,...e){return Ut("colgroup",t,...e)},div:function(t,...e){return Ut("div",t,...e)},em:function(t,...e){return Ut("em",t,...e)},embed:function(t,...e){return Ut("embed",t,...e)},fieldset:function(t,...e){return Ut("fieldset",t,...e)},footer:function(t,...e){return Ut("footer",t,...e)},form:function(t,...e){return Ut("form",t,...e)},h1:function(t,...e){return Ut("h1",t,...e)},h2:function(t,...e){return Ut("h2",t,...e)},h3:function(t,...e){return Ut("h3",t,...e)},h4:function(t,...e){return Ut("h4",t,...e)},h5:function(t,...e){return Ut("h5",t,...e)},h6:function(t,...e){return Ut("h6",t,...e)},header:function(t,...e){return Ut("header",t,...e)},hgroup:function(t,...e){return Ut("hgroup",t,...e)},hr:function(t,...e){return Ut("hr",t,...e)},i:function(t,...e){return Ut("i",t,...e)},img:function(t,...e){return Ut("img",t,...e)},input:function(t,...e){return Ut("input",t,...e)},label:function(t,...e){return Ut("label",t,...e)},li:function(t,...e){return Ut("li",t,...e)},mark:function(t,...e){return Ut("mark",t,...e)},nav:function(t,...e){return Ut("nav",t,...e)},ol:function(t,...e){return Ut("ol",t,...e)},optgroup:function(t,...e){return Ut("optgroup",t,...e)},option:function(t,...e){return Ut("option",t,...e)},p:function(t,...e){return Ut("p",t,...e)},pre:function(t,...e){return Ut("pre",t,...e)},progress:function(t,...e){return Ut("progress",t,...e)},q:function(t,...e){return Ut("q",t,...e)},s:function(t,...e){return Ut("s",t,...e)},section:function(t,...e){return Ut("section",t,...e)},select:function(t,...e){return Ut("select",t,...e)},small:function(t,...e){return Ut("small",t,...e)},span:function(t,...e){return Ut("span",t,...e)},strong:function(t,...e){return Ut("strong",t,...e)},sub:function(t,...e){return Ut("sub",t,...e)},sup:function(t,...e){return Ut("sup",t,...e)},table:function(t,...e){return Ut("table",t,...e)},tbody:function(t,...e){return Ut("tbody",t,...e)},td:function(t,...e){return Ut("td",t,...e)},textarea:function(t,...e){return Ut("textarea",t,...e)},tfoot:function(t,...e){return Ut("tfoot",t,...e)},th:function(t,...e){return Ut("th",t,...e)},thead:function(t,...e){return Ut("thead",t,...e)},tr:function(t,...e){return Ut("tr",t,...e)},u:function(t,...e){return Ut("u",t,...e)},ul:function(t,...e){return Ut("ul",t,...e)},e:Ut};t.Exir={View:Ct,VNode:Mt,jsx:jsx,mount:function(t,e){if(!e)throw Error("mount: target element is undefined");t.$isNode||(t=Mt.create(t).$render()),Lt(t,e,!0)},createComponent:Ct.create,render:Lt},t.h=jsx,t.jsx=jsx,t.v=Ft}();
//# sourceMappingURL=global.js.map
