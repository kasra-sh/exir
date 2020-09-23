const {View} = require("./vdom");

class XViewModel {
    model = {}
    methods = {}

    /**
     * @abstract {Function}
     * @return {View}
     */
    render() {}
}