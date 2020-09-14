function append(parent, ...elements) {
    window.dispatchEvent(new CustomEvent("x.dom.append", {detail: {parent, elements}}))
    parent.append(elements);
}

module.exports = {append}