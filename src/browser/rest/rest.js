require("./ajax");

X.makeHttpRequest = function (method, url, params, headers, content, callbacks) {
    let ajax = new X.Ajax(method.toUpperCase(), url, params, headers);
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
    callbacks.success && ajax.success(callbacks.success);
    callbacks.fail && ajax.fail(callbacks.fail);
    callbacks.progress && ajax.progress(callbacks.progress);
    callbacks.prepare && (ajax.preparedCallback = callbacks.prepare);
    return ajax;
};

X.sendRequest = function(opts) {
    return X.makeHttpRequest(opts.method || 'OPTIONS', opts.url, opts.params, opts.headers, new X.HttpContent(opts.type, opts.data), {
        success: opts.success,
        fail: opts.fail,
        progress: opts.progress
    }).send(opts.finish);
};

X.Get = function (url, params){
    return new X.Ajax('GET', url, params);
};

X.Post = function (url, params){
    return new X.Ajax('POST', url, params);
};

X.Delete = function (url, params){
    return new X.Ajax('DELETE', url, params);
};

X.Put = function (url, params){
    return new X.Ajax('PUT', url, params);
};

X.Patch = function (url, params){
    return new X.Ajax('PATCH', url, params);
};

X.sendGet = function (opt) {
    opt.method = 'GET';
    opt.type = undefined;
    opt.data = undefined;
    X.sendRequest(opt);
};

X.sendDelete = function (opt) {
    opt.method = 'DELETE';
    X.sendRequest(opt);
};

X.sendPost = function (opt) {
    opt.method = 'POST';
    X.sendRequest(opt);
};

X.sendPut = function (opt) {
    opt.method = 'PUT';
    X.sendRequest(opt);
};

X.sendPatch = function (opt) {
    opt.method = 'PATCH';
    X.sendRequest(opt);
}