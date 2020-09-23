// if (scope.isBrowser()) {
//     $event(window, "load", function (){
//         window.__WINLOADED__ = true;
//     });
//
//     function loaded(func) {
//         if (global.__WINLOADED__) {
//             func();
//         } else {
//             $event(window, "load", func);
//         }
//     }
//
//     const ap = Node.prototype.append;
//     window.X_DOMAPPENDEVENT = "dom.append";
//     Node.prototype.append = function (c) {
//         ap.call(this, c);
//         window.dispatchEvent(new CustomEvent(window.X_DOMAPPENDEVENT, {detail: {target: this}}))
//     }
//
//     const apc = Node.prototype.appendChild;
//     Node.prototype.appendChild = function (c) {
//         apc.call(this, c);
//         window.dispatchEvent(new CustomEvent(window.X_DOMAPPENDEVENT, {detail: {target: this}}))
//     }
//
// Add tracking for addEventListener
class Intercept {
    static addEventListener() {
        window.__NATIVE__ = window.__NATIVE__ || {};
        window.__NATIVE__.addEventListener = window.__NATIVE__.addEventListener || window.addEventListener;

        HTMLElement.prototype.addEventListener = Element.prototype.addEventListener =
            Node.prototype.addEventListener = function (type, listener, options) {
                window.__NATIVE__.addEventListener.call(this, type, listener, options);
                this.__EVENTS__ = this.__EVENTS__ || {};
                this.__EVENTS__[type] = this.__EVENTS__[type] || [];
                this.__EVENTS__[type].push({listener, options});
            }
    }
}
// }

