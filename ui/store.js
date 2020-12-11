import {isObj, isVal} from "../core/types";
import View from "./view";

export function createStore(reducer) {
    var state = reducer(undefined, {});

    if (!isVal(this.state)) throw TypeError('Store: Initial state is null or undefined,' +
        ' reducer does not return properly on random/empty state')

    Object.defineProperty(this, 'listeners', {
        value: [],
        writable: false,
        configurable: false
    })

    Object.defineProperty(this, 'reducer', {
        value: reducer,
        writable: false,
        configurable: false
    })

    this.subscribe = function (callback) {
        this.listeners.push(callback)
    }

    this.unsubscribe = function (callback) {
        this.listeners.splice(this.listeners.indexOf(callback), 1)
    }

    this.getState = function () {
        return state
    }

    this.dispatch = function (action) {
        state = reducer(this.getState(), action)
        this.listeners.forEach((callback)=>{
            setTimeout(callback, 1)
        })
    }

}

export function createGlobalStore(reducer) {
    View.prototype.$store = createStore(reducer)
}

export function setGlobalStore(store) {
    View.prototype.$store = store
}