const Ajax = require("./ajax").Ajax;
const Rq = require("./request");
let Http = {}
// Http.Ajax = Ajax;
/**
 *
 * @param method {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'}
 * @param url {String}
 * @param params Object
 * @param headers Object
 * @param content {{type: ('json', 'urlencoded', 'form', '*'), data: Object|String}}
 * @param callbacks {{success:Function?, fail: Function?, progress: Function?, prepare: Function?,
 * uploadProgress: Function?, uploadFinish: Function?}}
 * @return {Ajax}
 */
Http.makeHttpRequest = function (method, url, params, headers, content, callbacks) {
    let ajax = new Ajax(method.toUpperCase(), url, params, headers);
    if (content && content.type) {
        if (content.type.toLowerCase() === 'json') {
            ajax.jsonData(content.data);
        } else if (content.type.toLowerCase() === 'urlencoded') {
            ajax.urlEncodedData(content.data);
        } else if (content.type.toLowerCase() === 'form') {
            ajax.formData(content.data);
        } else {
            ajax.Rq.setContent(content.type, content.data);
        }
    }
    callbacks.success && ajax.onSuccess(callbacks.success);
    callbacks.fail && ajax.onFail(callbacks.fail);
    callbacks.progress && ajax.onProgress(callbacks.progress);
    callbacks.prepare && (ajax.preparedCallback = callbacks.prepare);
    callbacks.uploadProgress && (ajax.uploadProgressCallback = callbacks.uploadProgress);
    callbacks.uploadFinish && (ajax.uploadFinishCallback = callbacks.uploadFinish);
    return ajax;
};
/**
 *
 * @param opts {{method, url, args, headers, type, data, success, fail, progress, prepare, uploadProgress, uploadFinish}}
 * @return {Ajax}
 */
Http.makeRequest = function(opts) {
    return Http.makeHttpRequest(opts.method || 'OPTIONS', opts.url, opts.args, opts.headers, new Rq.HttpContent(opts.type, opts.data), {
        success: opts.success,
        fail: opts.fail,
        progress: opts.progress,
        prepare: opts.prepare,
        uploadProgress: opts.uploadProgress,
        uploadFinish: opts.uploadFinish
    })
};

Http.makePromise = function(r, resolved = null, params = null) {
    return new Promise((res, rej) => {
        r.onSuccess(()=>{
            if (resolved)
                try {
                    resolved(params);
                } catch (e) {}
            return res(r)
        });
        r.onFail(()=>rej(r));
    })
}

/**
 *
 * @param opts {{method, url, args, headers, type, data, success, fail, progress, prepare, finish, uploadProgress, uploadFinish}}
 * @return {Promise<any>}
 */
Http.sendRequest = async function sendRequest(opts) {
    let r = Http.makeRequest(opts);
    r.send(opts.finish);
    return await Http.makePromise(r);
}

Http.Get = function (url, params){
    return new Ajax('GET', url, params);
};

Http.Post = function (url, params){
    return new Ajax('POST', url, params);
};

Http.Delete = function (url, params){
    return new Ajax('DELETE', url, params);
};

Http.Put = function (url, params){
    return new Ajax('PUT', url, params);
};

Http.Patch = function (url, params){
    return new Ajax('PATCH', url, params);
};

/**
 * {@inheritDoc REST.sendRequest}
 * @return {Promise<*>}
 */
Http.sendGet = function (opt) {
    opt.method = 'GET';
    opt.type = undefined;
    opt.data = undefined;
    return Http.sendRequest(opt)
};

Http.sendDelete = function (opt) {
    opt.method = 'DELETE';
    return Http.sendRequest(opt)
};

Http.sendPost = function (opt) {
    opt.method = 'POST';
    return Http.sendRequest(opt)
};

Http.sendPut = function (opt) {
    opt.method = 'PUT';
    return Http.sendRequest(opt)
};

Http.sendPatch = function (opt) {
    opt.method = 'PATCH';
    return Http.sendRequest(opt)
};

module.exports = Http;