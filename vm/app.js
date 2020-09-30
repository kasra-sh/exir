const {$$} = require("../dom");

class App {
    /**
     * App render root
     * @type {string}
     */
    root = 'body'
    constructor(root) {
        this.root = root;
    }
}

module.exports = {App}