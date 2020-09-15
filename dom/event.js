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
function event(target, event, listener, options) {
    if (!scope.isBrowser()) {
        L.error("Events are browser only!");
        return
    }
    if (!T.isArr(event)) {
        if (I.contains(event,' ')) {
            event = event.split(' ').Map((it)=>it.trim())
        } else
            event = [event];
    }
    target.__EVENTS__ = target.__EVENTS__ || {};
    I.ForEach(event,function (ev) {
        target.__EVENTS__[ev] = target.__EVENTS__[ev] || [];
        let f = function (e) {
            listener(e, target);
        };
        if (!T.hasField(options, 'duplicates', (a)=>a)) {
            // console.log('removing dups')
            target.__EVENTS__[ev] = I.Filter(target.__EVENTS__[ev],(fl)=> {
                if (T.funcEqual(fl.l, listener)) {
                    target.removeEventListener(ev, fl.f, fl.o);
                    return false
                } else {
                    console.log('notEqual',fl.l.toString(), listener.toString())
                }
            });
        }

        target.__EVENTS__[ev].push({f:f, l:listener, o: options});
        target.addEventListener(ev, f, options);
    });
}

module.exports = {event};