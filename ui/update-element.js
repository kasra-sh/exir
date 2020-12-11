import {forEach} from "../core/collections";
import {clearEvent, hasEvent, setEvent} from "../dom/event";
import {compileStyles} from "./util";

export function updateAttributes(newAttrs, currentAttrs, element) {
    const newKeys = Object.keys(newAttrs)
    const currentKeys = Object.keys(currentAttrs)

    const keys = Object.keys(newAttrs)
    // const len = keys.length
    // console.log(newAttrs, currentAttrs)
    for (let key of keys) {
        const newVal = newAttrs[key]
        // if (currentKeys.indexOf(key) < 0) {
        //     element.setAttribute(key, newVal)
        // } else {
            const curVal = currentAttrs[key]
            if (key === 'style') {
                const newStyle = compileStyles(newVal, ' ')
                const currentStyle = compileStyles(curVal, ' ')
                if (newStyle !== currentStyle) {
                //     console.log()
                    element.setAttribute('style', newStyle)
                }
            } else if (key === 'className') {
                element.setAttribute('class', newVal)
            } else {
                element.setAttribute(key, newVal)
            }
        // }
    }
    for (let key of currentKeys) {
        if (newKeys.indexOf(key) < 0) {
            element.removeAttribute(key)
        }
    }
}

export function updateEventListeners(newEvents={}, oldEvents={}, element) {
    forEach(oldEvents, function (listener, event) {
        if (newEvents[event] !== listener) {
            clearEvent(element, event)
        }
    })
    forEach(newEvents, function (listener, event) {
        // console.log(event, listener)
        setEvent(element, event, listener)
    })


}