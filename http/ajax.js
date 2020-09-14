const S = require("../core/scope");
const Rq = require("./request");
const Rs = require("./response");
const T = require("../core/types");
const I = require("../core/stream");
class Ajax {
    Rq = {}
    Rs = {}
    constructor(m, url, params={}, headers={}, content=new Rq.HttpContent())  {
        if (m instanceof Rq.HttpRq) {
            this.Rq = m
        } else {
            this.Rq = new Rq.HttpRq(m, url, params, headers, content);
        }
        // Fields
        this.Rs = {readyState: 0};
        this.xhr = new XMLHttpRequest();
        // Events
        this.preparedCallback = function (rq) {
            // to be overridden
        };

        this.progressCallback = function (ev, rq) {
            // to be overridden
        };

        this.uploadProgressCallback = function (xhr) {
        };

        this.successCallback = function (rq, rs) {
            // to be overridden
            // console.log('REQUEST:', rq, 'RESPONSE:', rs)
        };
        this.uploadFinishCallback = function (xhr) {

        };
        this.failCallback = function (rq, rs) {
            // to be overridden
            // console.log('REQUEST:', rq, 'RESPONSE:', rs)
        };
        Object.defineProperty(this, 'xhr', {enumerable: false})
        // Object.seal(this);
    }

    // Methods
    header (n, v) {
        this.Rq.setHeader(n, v);
        return this;
    };

    headers (hdrs) {
        I.ForEach(hdrs, (v, k) =>{
            this.Rq.setHeader(k, v);
        });
        return this;
    };

    onSuccess (callbackRqRs) {
        this.successCallback = callbackRqRs;
        return this;
    };

    onUploadSuccess (callbackRqRs) {
        this.uploadFinishCallback = callbackRqRs;
        return this;
    };

    onFail (callbackRqRs) {
        this.failCallback = callbackRqRs;
        return this;
    };

    onProgress (callbackRqRs) {
        this.progressCallback = callbackRqRs;
        return this;
    };

    onUploadProgress (callbackRqRs) {
        this.uploadProgressCallback = callbackRqRs;
        return this;
    };

    withContent(content) {
        this.Rq.setContent(content.type, content.data);
    }

    xmlData (data) {
        this.Rq.xmlContent(data);
        return this;
    }

    formData (form) {
        this.Rq.formContent(form);
        return this;
    };

    jsonData (data) {
        this.Rq.jsonContent(data);
        return this;
    };

    urlEncodedData (data) {
        this.Rq.formUrlEncodedContent(data);
        return this;
    };

    _prepare (reset) {
        if (this.isPrepared && !reset) {
            // self.onprepare && self.onprepare(self.Rq);
            return this
        }

        // prepare url
        let url = this.Rq.url;

        if (this.Rq.args && !T.isEmpty(this.Rq.args)) {
            url.indexOf('?')>=0 || (url += '?');
            url += this.Rq.buildUrlEncoded();
        }
        reset && (this.xhr = new XMLHttpRequest());
        this.xhr.open(this.Rq.method, url);

        // prepare headers
        for (let h in this.Rq.headers) {
            if (this.Rq.headers.hasOwnProperty(h))
            this.xhr.setRequestHeader(h, this.Rq.headers[h]);
        }

        this.isPrepared = true;
        this.preparedCallback && this.preparedCallback(this.Rq);
        // preparedCallback && preparedCallback();
        return this;
    };

    send (finishCallback) {
        // let rqi = X.AjaxInterceptors.__rq.First((ic)=>ic(this));
        this._prepare();
        let ajax = this;
        let xhr = this.xhr;
        this.xhr.onreadystatechange = function (ev) {

            // onloadend
            if (xhr.readyState === 4) {
                let callback;
                if (xhr.status >= 200 && xhr.status <= 399) {
                    callback = ajax.successCallback;
                } else {
                    callback = ajax.failCallback;
                }
                ajax.Rs = new Rs.HttpRs(xhr);
                // let rsi = X.AjaxInterceptors.__rs.First((ic)=>ic(this));
                finishCallback && finishCallback(ajax.Rq, ajax.Rs, ajax.xhr);
                callback && callback(ajax.Rq, ajax.Rs, ajax.xhr);
            }
        };
        this.xhr.onprogress = function (ev) {
            ajax.progressCallback && ajax.progressCallback(ev, ajax);
        };

        this.xhr.upload.onprogress = function (ev) {
            ajax.uploadProgressCallback && ajax.uploadProgressCallback(ev, ajax);
        };

        this.xhr.upload.onloadend = function (ev) {
            ajax.uploadFinishCallback && ajax.uploadFinishCallback(ev, ajax);
        };

        this.xhr.send(this.Rq.content.data);

        return ajax;
    }
}

module.exports = {Ajax: Ajax};