import {compileStyles} from "./util";

export function updateAttributes(newAttrs, currentAttrs, element) {
    const newKeys = Object.keys(newAttrs)
    const currentKeys = Object.keys(currentAttrs)

    const keys = Object.keys(newAttrs)
    // const len = keys.length
    for (let key of keys) {
        const newVal = newAttrs[key]
        if (currentKeys.indexOf(key) < 0) {
            element.setAttribute(key, newVal)
        } else {
            if (key === 'style') {
                const newStyle = compileStyles(newVal, ' ')
                const currentStyle = compileStyles(newVal, ' ')
                if (newStyle !== currentStyle) {
                    element.setAttribute('style', newStyle)
                }
            } else {
                if (newVal !== currentAttrs[key]) {
                    element.setAttribute(key, newVal)
                }
            }
        }
    }
    for (let key of currentKeys) {
        if (newKeys.indexOf(key) < 0) {
            element.removeAttribute(key)
        }
    }
}
