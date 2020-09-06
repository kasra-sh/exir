require("./vdom");

class XViewModel {
    model = {}
    methods = {}

    /**
     * @abstract {Function}
     * @return {VDom}
     */
    render() {}
}