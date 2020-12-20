const {renderDom} = require("./render");
const VNode = require("./vnode_base"); require("./vnode");

function mount(template, element) {
    if (!element) throw Error('mount: target element is undefined')
    if (!template.$isNode) template = VNode.create(template).$render()
    renderDom(template, element, true)
}

module.exports = mount;