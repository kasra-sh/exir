const http = require('./methods')

class InterceptorStore {
    all = []
    use(interceptor) {
        this.all.push(interceptor);
    }
}

class XHttpClient {
    base
    queue = []
    sending = []
    interval
    maxPerMinute
    interceptors = {
        request : new InterceptorStore(),
        response: new InterceptorStore()
    }

    constructor(base_path = '') {
        this.base = base_path;
    }

    async _intervalSend() {
        if (this.queue.length === 0) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
        // fix promise
        let ajax = this.queue.pop();
        ajax.send();
    }

    _addRequest(ajax) {
        this.queue.push(ajax);
        if (!this.interval) {
            this.interval = setInterval(this._intervalSend, 1);
        }
        return http.makePromise(ajax);
    }

    send(ajax) {
        this._addRequest(ajax)
    }

    get(route, args= {params:{}, headers:{}}) {
        return this._addRequest(http.Get(this.base+route, args.params).headers(args.headers));
    }

    _contentRequest(method, route, args) {
        return this._addRequest(
            method(this.base+route, args || {})
                .headers(args.headers || {})
                .withContent(args.content || {type: '', data: ''})
        )
    }

    post(route, args={}, headers={}, content) {
        return this._contentRequest(http.Post, route, args, headers, content);
    }

    put(route, args={}, headers={}, content) {
        return this._contentRequest(http.Put, route, args, headers, content);
    }

    patch(route, args={}, headers={}, content) {
        return this._contentRequest(http.Patch, route, args, headers, content);
    }

    delete(route, args={}, headers={}, content) {
        return this._contentRequest(http.Delete, route, args, headers, content);
    }
}

module.exports = {XHttpClient}