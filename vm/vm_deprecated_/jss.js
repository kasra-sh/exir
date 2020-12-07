const {kebab} = require("../../core/cases")
const {forEach} = require("../../core/collections")

function generateStyles(jss) {
    let styles = []
    forEach(jss, (val, prop)=>{
        styles.push(`${kebab(prop)}: ${val};`)
    })
    return styles
}

function generateCss(jss, joinWith='\n') {
    return generateStyles(jss).sort((a, b)=>a[0].localeCompare(b[0])).join(joinWith);
}

module.exports = {generateStyles, generateCss}