const {clearEvent, setEvent} = require("../dom/event");
const {forEach} = require("../core/collections");
const {compileStyles} = require("./utils");

function patchAttrs(newAttrs, oldAttrs, element) {
    const newKeys = Object.keys(newAttrs)
    const currentKeys = Object.keys(oldAttrs)

    const keys = Object.keys(newAttrs)
    // const len = keys.length
    // console.log(newAttrs, oldAttrs)
    for (let key of keys) {
        const newVal = newAttrs[key]
        // if (currentKeys.indexOf(key) < 0) {
        //     element.setAttribute(key, newVal)
        // } else {
        const curVal = oldAttrs[key]
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

function patchEvents(newEvents={}, oldEvents={}, element) {
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

module.exports = {
    patchAttrs,
    patchEvents
}