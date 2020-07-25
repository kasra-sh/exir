require("./base")
require("./prototypes")
X.event = function (el, event, listener, removeDups = true) {
    if (!X.isArr(event)) {
        if (event.contains(' ')) {
            event = event.split(' ').Map((it)=>it.trim())
        } else
            event = [event];
    }
    el.__EVENTS__ = el.__EVENTS__ || {};
    event.forEach(function (ev) {
        el.__EVENTS__[ev] = el.__EVENTS__[ev] || [];
        let f = function (e) {
            listener(e, el);
        };
        if (removeDups) {
            el.__EVENTS__[ev] = el.__EVENTS__[ev].Filter((fl)=> {
                if (fl.l.toString()===listener.toString()) {
                    el.removeEventListener(ev, fl.f);
                    return false
                }
            });
        }

        el.__EVENTS__[ev].push({f:f, l:listener});
        el.addEventListener(ev, f);
    });
}
X.event(X.$WIN, "load", function (){
    X.__WINLOADED__ = true;
});

X.loaded = function (func) {
    if (X.__WINLOADED__) {
        func();
    } else {
        X.event(X.$WIN, "load", func);
    }
}