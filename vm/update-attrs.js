// import {compileStyles} from "../vm/util";
import {isArr, isStr, isVal} from "../core";
import JSS from "./jss";

export function compileStyles(styles, joinWith) {
    if (!isVal(styles)) return ''
    else if (isStr(styles)) return styles
    else if (isArr(styles)) return styles.join(joinWith)
    return JSS.generateCss(styles, joinWith)
}

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
