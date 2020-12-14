/**
 * Asynchronous Http Client using XHR
 * @module http/client
 * @memberOf http
 */

const http = require('./methods');
const {error} = require("../core/logging");
const {Ajax} = require("./ajax");
const {startsWith, endsWith, filter, forEach} = require('../core/collections');


class InterceptorStore {
    constructor() {
        this.all = []
        this.any = false
    }

    use(interceptor) {
        this.all.push(interceptor);
        this.any = true
    }

    async intercept(ajax) {
        for (let i = 0; i < this.all.length; i++) {
            ajax = await this.all[i](ajax)
        }
        return ajax
    }
}

/**
 * Async Http Client using XHR
 * @class
 */
class XHttpClient {
    /**
     *
     * @param {String} host - Server host address
     * @param {Number} [ratePerMinute] - Maximum requests allowed per minute (default 300)
     * @param {Object} [defaultParams] - Default params set on every request
     * @param {Object} [defaultHeaders] - Default headers set on every request
     * @param {Number} [timeout=3000]
     * @param {Number} [retries]
     */
    constructor(host = '', {
        ratePerMinute = 300,
        defaultParams,
        defaultHeaders,
        timeout, retries
    } = {}) {
        if (endsWith(host, '/')) {
            host = host.split('').splice(host.length - 1).join()
        }
        /**
         * Interceptors
         * @type {{request: InterceptorStore, response: InterceptorStore}}
         */
        this.interceptors = {
            request: new InterceptorStore(),
            response: new InterceptorStore()
        }
        this.host = host
        this.__queue = []
        this.__sending = []
        this.__interval = undefined
        this.__ratePerMinute = ratePerMinute
        this.__timeBetween = 60000 / ratePerMinute
        this.__lastRequestTime = new Date().getTime() - this.__timeBetween;
        this.timeout = timeout || 60000
        this.retries = retries || 0
        this.defaultHeaders = defaultHeaders || {}
        this.defaultParams = defaultParams || {}
    }

    /**
     *
     * @param client
     * @private
     */
    _intervalSend(client) {
        if (client.__queue.length === 0) {
            clearInterval(client.__interval);
            client.__interval = undefined;
            return;
        }
        let now = new Date().getTime();
        if (now - client.__lastRequestTime > client.__timeBetween) {
            let ajax = client.__queue.shift();
            client._sendImmediately(ajax, now);
        }
    }

    _sendImmediately(ajax, now) {
        if (this.interceptors.request.any) {
            this.interceptors.request.intercept(ajax).then(() => {
                ajax.send()
                this.__sending.push(ajax);
                this.__lastRequestTime = now;
            }).catch((e) => {
                console.error(e)
            })
        } else {
            ajax.send()
            this.__sending.push(ajax);
            this.__lastRequestTime = now;
        }
    }

    _removeSendingRequest(request) {
        let rqi = this.__sending.indexOf(request);
        if (rqi >= 0) {
            this.__sending.splice(rqi);
        }
    }

    /**
     *
     * @param ajax
     * @param responseType
     * @param cancelToken
     * @return {Promise<Ajax>}
     * @private
     */
    _addRequest(ajax, {responseType, cancelToken}) {
        this.__queue.push(ajax);
        if (!this.__interval) {
            this.__interval = setInterval(this._intervalSend, 1, this);
        }
        ajax.cancelToken = cancelToken;
        if (responseType) ajax.xhr.responseType = responseType;
        ajax.RETRIES = 0
        ajax.xhr.timeout = this.timeout
        if (this.defaultHeaders) {
            ajax.headers(this.defaultHeaders)
        }
        if (this.defaultParams) {
            forEach(this.defaultParams, (val, key) => {
                ajax.rq.setArg(key, val)
            })
        }
        let promise = http.makePromise(ajax, {
            default(ajax, res, rej, client) {
                client._removeSendingRequest(ajax)
            },
            onSuccess(ajax, res, rej, client) {
                if (client.interceptors.response.any) {
                    client.interceptors.response.intercept(ajax)
                        .then(() => res(ajax))
                        .catch((e) => rej(e))
                } else res(ajax)
            },
            onFail(ajax, res, rej, client) {
                if (client.interceptors.response.any) {
                    client.interceptors.response.intercept(ajax)
                        .then(() => rej(ajax))
                        .catch((ajax, err) => rej(ajax, err))
                } else rej(ajax)
                return rej(ajax, Error('Request failed.'))
            },
            onTimeout(ajax, res, rej, client) {
                if (ajax.RETRIES >= client.retries) {
                    return rej(ajax, Error('Request timed out after ' + ajax.RETRIES + ' retries.'))
                }
                client.__sending.push(ajax.resend());
                ajax.RETRIES += 1;
            }
        }, this);
        ajax._promise_ = promise;
        return promise
    }

    /**
     * Add ajax request to queue
     * @param {Ajax} ajax
     */
    send(ajax) {
        return this._addRequest(ajax)
    }

    /**
     *
     * @param method
     * @param route
     * @param params
     * @param headers
     * @param content
     * @param responseType
     * @param cancelToken
     * @return {Promise<Ajax>}
     * @private
     */
    _contentRequest(method, route, {params, headers, content, responseType, cancelToken}) {
        if (!startsWith(route, '/') && route.length > 1) {
            route = '/' + route;
        }
        return this._addRequest(
            method(this.host + route, params || {})
                .headers(headers || {})
                .withContent(content || {type: '', data: ''})
            , {responseType, cancelToken})
    }

    /**
     * Enqueue http GET request
     *
     * @param {String} route - request route - appends to host address
     * @param {Object} [params] - request params(args)
     * @param {Object} [headers] - request headers
     * @param {String} [responseType] - "text"|"json"|"xml"|"document"|"arraybuffer"|"blob"|"ms-stream"|""
     * @param {String} [cancelToken] - A token used to cancel a group of requests
     * @return {Promise<Ajax>}
     */
    get(route, {params, headers, responseType, cancelToken} = {}) {
        if (!startsWith(route, '/') && route.length > 1) {
            route = '/' + route;
        }
        return this._addRequest(http.Get(this.host + route, params).headers(headers), {responseType, cancelToken});
    }

    /**
     * Enqueue http POST request
     *
     * @param {String} route - request route - appends to host address
     * @param {Object} [params] - request params(args)
     * @param {Object} [headers] - request headers
     * @param {http.HttpContent|Object} [content] - request content. example: {type:'json', data={count: 13}}
     * @param {String} [responseType] - "text"|"json"|"xml"|"document"|"arraybuffer"|"blob"|"ms-stream"|""
     * @param {String} [cancelToken] - A token used to cancel a group of requests
     * @return {Promise<Ajax>}
     */
    post(route, {params, headers, content, responseType, cancelToken} = {}) {
        return this._contentRequest(http.Post, route, {params, headers, content, responseType, cancelToken});
    }

    /**
     * Enqueue http PUT request
     *
     * @param {String} route - request route - appends to host address
     * @param {Object} [params] - request params(args)
     * @param {Object} [headers] - request headers
     * @param {http.HttpContent} [content] - request content. example: {type:'json', data={count: 13}}
     * @param {String} [responseType] - "text"|"json"|"xml"|"document"|"arraybuffer"|"blob"|"ms-stream"|""
     * @param {String} [cancelToken] - A token used to cancel a group of requests
     * @return {Promise<Ajax>}
     */
    put(route, {params, headers, content, responseType, cancelToken} = {}) {
        return this._contentRequest(http.Put, route, {params, headers, content, responseType, cancelToken});
    }

    /**
     * Enqueue http PATCH request
     *
     * @param {String} route - request route - appends to host address
     * @param {Object} [params] - request params(args)
     * @param {Object} [headers] - request headers
     * @param {http.HttpContent} [content] - request content. example: {type:'json', data={count: 13}}
     * @param {String} [responseType] - "text"|"json"|"xml"|"document"|"arraybuffer"|"blob"|"ms-stream"|""
     * @param {String} [cancelToken] - A token used to cancel a group of requests
     * @return {Promise<Ajax>}
     */
    patch(route, {params, headers, content, responseType, cancelToken} = {}) {
        return this._contentRequest(http.Patch, route, {params, headers, content, responseType, cancelToken});
    }

    /**
     * Enqueue http DELETE request
     *
     * @param {String} route - request route - appends to host address
     * @param {Object} [params] - request params(args)
     * @param {Object} [headers] - request headers
     * @param {http.HttpContent} [content] - request content. example: {type:'json', data={count: 13}}
     * @param {String} [responseType] - "text"|"json"|"xml"|"document"|"arraybuffer"|"blob"|"ms-stream"|""
     * @param {String} [cancelToken] - A token used to cancel a group of requests
     * @return {Promise<Ajax>}
     */
    delete(route, {params, headers, content, responseType, cancelToken} = {}) {
        return this._contentRequest(http.Delete, route, {params, headers, content, responseType, cancelToken});
    }

    /**
     * Cancel all requests(sending or enqueued) with given token
     * @param {String} token
     */
    cancel(token) {
        this.__queue = filter(this.__queue, (a) => a.cancelToken !== token);
        let sending = filter(this.__sending, (a) => a.cancelToken === token);
        forEach(sending, (ajax) => {
            try {
                ajax.xhr.abort();
            } catch (e) {
                console.error(e)
            }
        });

        this.__sending = filter(this.__sending, (a) => a.cancelToken !== token);
    }

    cancelAll() {
        if (this.__interval >= 0) clearInterval(this.__interval);
        setTimeout(()=>{
            forEach(this.__sending, function (a) {
                try {
                    a.xhr.abort()
                } catch (e) {
                }
            });
            this.__queue = []
        }, 1)
    }
}

module.exports = {XHttpClient}