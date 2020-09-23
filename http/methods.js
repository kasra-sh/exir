const Ajax = require("./ajax").Ajax;
const {HttpContent} = require("./request");

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
function makeHttpRequest(method, url, params, headers, content, callbacks) {
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
}
/**
 *
 * @param opts {{method, url, args, headers, type, data, success, fail, progress, prepare, uploadProgress, uploadFinish}}
 * @return {Ajax}
 */
function makeRequest(opts) {
    return makeHttpRequest(opts.method || 'OPTIONS', opts.url, opts.args, opts.headers, new HttpContent(opts.type, opts.data), {
        success: opts.success,
        fail: opts.fail,
        progress: opts.progress,
        prepare: opts.prepare,
        uploadProgress: opts.uploadProgress,
        uploadFinish: opts.uploadFinish
    })
}

function makePromise(r, resolved = null, params = null) {
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
async function sendRequest(opts) {
    let r = makeRequest(opts);
    r.send(opts.finish);
    return await makePromise(r);
}

function Get(url, params){
    return new Ajax('GET', url, params);
}

function Post(url, params){
    return new Ajax('POST', url, params);
}

function Delete(url, params){
    return new Ajax('DELETE', url, params);
}

function Put(url, params){
    return new Ajax('PUT', url, params);
}

function Patch(url, params){
    return new Ajax('PATCH', url, params);
}

/**
 * {@inheritDoc sendRequest}
 * @return {Promise<*>}
 */
function sendGet(opt) {
    opt.method = 'GET';
    opt.type = undefined;
    opt.data = undefined;
    return sendRequest(opt)
}

function sendDelete(opt) {
    opt.method = 'DELETE';
    return sendRequest(opt)
}

function sendPost(opt) {
    opt.method = 'POST';
    return sendRequest(opt)
}

function sendPut(opt) {
    opt.method = 'PUT';
    return sendRequest(opt)
}

function sendPatch(opt) {
    opt.method = 'PATCH';
    return sendRequest(opt)
}

module.exports = {
    makeHttpRequest, makeRequest, makePromise, sendRequest,
    Get, Post, Delete, Put, Patch,
    sendGet, sendDelete, sendPost, sendPut, sendPatch
};