const http = require('./methods');
const {startsWith, endsWith, contains, all, filter, forEach} = require('../core/collections');

/**
 * @class
 * @category Http
 * */
class InterceptorStore {
    all = []
    use(interceptor) {
        this.all.push(interceptor);
    }
}

/**
 * @class
 * @category Http
 * */
class XHttpClient {
    host = ""
    __queue = []
    __sending = []
    __interval
    __timeBetween
    __ratePerMinute
    __lastRequestTime
    interceptors = {
        request : new InterceptorStore(),
        response: new InterceptorStore()
    }

    constructor(host = '' ,{ratePerMinute = 300}={}) {
        if (endsWith(host, '/')) {
            host = host.split('').splice(host.length-1).join()
        }
        this.host = host
        this.__ratePerMinute = ratePerMinute
        this.__timeBetween = 60000/ratePerMinute
        this.__lastRequestTime = new Date().getTime() - this.__timeBetween;
    }

    _intervalSend(client) {
        if (client.__queue.length === 0) {
            clearInterval(client.__interval);
            client.__interval = undefined;
            return;
        }
        let now = new Date().getTime();
        if (now - client.__lastRequestTime > client.__timeBetween) {
            let ajax = client.__queue.pop().send();
            client.__sending.push(ajax);
            client.__lastRequestTime = now;
        }
    }

    _addRequest(ajax, {responseType, cancelToken}) {
        this.__queue.push(ajax);
        if (!this.__interval) {
            this.__interval = setInterval(this._intervalSend, 1, this);
        }
        ajax.cancelToken = cancelToken;
        console.log(responseType)
        if (responseType) ajax.xhr.responseType = responseType;
        return http.makePromise(ajax, ({client, request}) => {
            let rqi = client.__sending.indexOf(request);
            if (rqi >= 0) {
                client.__sending.splice(rqi);
            }
        }, {client: this, request: ajax});
    }

    send(ajax) {
        this._addRequest(ajax)
    }

    _contentRequest(method, route, {params, headers, content,responseType, cancelToken}) {
        if (!startsWith(route, '/') && route.length > 1) {
            route = '/' + route;
        }
        return this._addRequest(
            method(this.host+route, params || {})
                .headers(headers || {})
                .withContent(content || {type: '', data: ''})
        , {responseType,cancelToken})
    }

    get(route, {params, headers, responseType, cancelToken}={}) {
        if (!startsWith(route, '/') && route.length > 1) {
            route = '/' + route;
        }
        return this._addRequest(http.Get(this.host+route, params).headers(headers), {responseType, cancelToken});
    }

    post(route, {params, headers, content,responseType, cancelToken}={}) {
        return this._contentRequest(http.Post, route, {params, headers, content,responseType, cancelToken});
    }

    put(route, {params, headers, content,responseType, cancelToken}={}) {
        return this._contentRequest(http.Put, route, {params, headers, content,responseType, cancelToken});
    }

    patch(route, {params, headers, content,responseType, cancelToken}={}) {
        return this._contentRequest(http.Patch, route, {params, headers, content,responseType, cancelToken});
    }

    delete(route, {params, headers, content,responseType, cancelToken}={}) {
        return this._contentRequest(http.Delete, route, {params, headers, content,responseType, cancelToken});
    }

    cancel(token) {
        this.__queue = filter(this.__queue, (a)=>a.cancelToken !== token);
        let sending = filter(this.__sending, (a)=>a.cancelToken === token);
        forEach(sending, (ajax)=>{
            try {
                ajax.xhr.abort();
            } catch (e) {
                console.log(e)
            }
        });

        this.__sending = filter(this.__sending, (a)=>a.cancelToken !== token);
    }
}

/**
 *
 * @export XHttpClient
 */
module.exports = {XHttpClient}