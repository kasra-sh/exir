const {HttpRq, HttpContent} = require("./request");
const {HttpRs} = require("./response");
const T = require("../core/types");
const {forEach} = require("../core/collections");


/**
 * A wrapper class for {@link XMLHttpRequest} to facilitate sending requests and handling events
 * @property {HttpRq} rq - Request data object
 * @property {HttpRs} rs - Response data object
 * @memberOf http
 */
class Ajax {
    rq = {}
    rs = {}

    /**
     * @constructor
     * @param {HttpMethod|HttpRq} m - Request method string or HttpRq object
     * @param {String} [url]
     * @param {Object} [params] - Request parameters object
     * @param {Object?} [headers] - Headers object
     * @param {HttpContent?} [content] - Optional http content {@link HttpContent}
     */
    constructor(m, url, params = {}, headers = {}, content = new HttpContent()) {
        if (m instanceof HttpRq) {
            this.rq = m
        } else {
            this.rq = new HttpRq(m, url, params, headers, content);
        }
        // Fields
        this.rs = {readyState: 0};
        this.xhr = new XMLHttpRequest();

        this.preparedCallback = function (rq) {
        };

        this.progressCallback = function (ev, rq) {
        };

        this.uploadProgressCallback = function (xhr) {
        };

        this.successCallback = function (rq, rs) {
        };
        this.uploadFinishCallback = function (xhr) {

        };
        this.failCallback = function (rq, rs) {
        };
        Object.defineProperty(this, 'xhr', {enumerable: false})
    }

    // Methods
    /**
     * Set header
     * @param {String} n - header name
     * @param {String} [v] - header value
     * @returns {Ajax}
     */
    header(n, v) {
        this.rq.setHeader(n, v);
        return this;
    };

    /**
     * Add/Set headers
     * @param {Object} hdrs - headers object
     * @returns {Ajax}
     */
    headers(hdrs = {}) {
        forEach(hdrs, (v, k) => {
            this.rq.setHeader(k, v);
        });
        return this;
    };

    /**
     * @param {Function} callbackRqRs
     * @returns {Ajax}
     */
    onSuccess(callbackRqRs) {
        this.successCallback = callbackRqRs;
        return this;
    };

    /**
     * @param {Function} callbackRqRs
     * @returns {Ajax}
     */
    onUploadSuccess(callbackRqRs) {
        this.uploadFinishCallback = callbackRqRs;
        return this;
    };

    /**
     * @param {Function} callbackRqRs
     * @returns {Ajax}
     */
    onFail(callbackRqRs) {
        this.failCallback = callbackRqRs;
        return this;
    };

    /**
     * @param {Function} callbackRqRs
     * @returns {Ajax}
     */
    onProgress(callbackRqRs) {
        this.progressCallback = callbackRqRs;
        return this;
    };

    /**
     * @param {Function} callbackRqRs
     * @returns {Ajax}
     */
    onUploadProgress(callbackRqRs) {
        this.uploadProgressCallback = callbackRqRs;
        return this;
    };

    /**
     * Set custom content {@link HttpContent}
     * @param {HttpContent} content
     * @returns {Ajax}
     */
    withContent(content={}) {
        switch (content.type) {
            case 'json': this.rq.jsonContent(content.data); break;
            case 'xml': this.rq.xmlContent(content.data); break;
            case 'form': this.rq.formContent(content.data); break;
            case 'form_multipart': this.rq.formMultiPartContent(content.data); break;
            case 'form_urlencoded': this.rq.formUrlEncodedContent(content.data); break;
            default: this.rq.setContent(content.type, content.data);
        }
        return this;
    }

    /**
     * Set xml request data
     * @param {XMLDocument} data
     * @returns {Ajax}
     */
    xmlData(data) {
        this.rq.xmlContent(data);
        return this;
    }

    /**
     * Set form-data request data
     * @param {String|Node} form
     * @returns {Ajax}
     */
    formData(form) {
        this.rq.formContent(form);
        return this;
    };

    /**
     * Set json request data
     * @param {String|Object} data
     * @returns {Ajax}
     */
    jsonData(data) {
        this.rq.jsonContent(data);
        return this;
    };

    /**
     * Set url-encoded request data
     * @param {Object} data - simple data object
     * @returns {Ajax}
     */
    urlEncodedData(data) {
        this.rq.formUrlEncodedContent(data);
        return this;
    };

    _prepare(reset) {
        if (this.isPrepared && !reset) {
            // self.onprepare && self.onprepare(self.rq);
            return this
        }

        // prepare url
        let url = this.rq.url;

        if (this.rq.args && !T.isEmpty(this.rq.args)) {
            url.indexOf('?') >= 0 || (url += '?');
            url += this.rq.buildUrlEncoded();
        }
        reset && (this.xhr = new XMLHttpRequest());
        this.xhr.open(this.rq.method, url);

        // prepare headers
        for (let h in this.rq.headers) {
            if (this.rq.headers.hasOwnProperty(h))
                this.xhr.setRequestHeader(h, this.rq.headers[h]);
        }

        this.isPrepared = true;
        this.preparedCallback && this.preparedCallback(this.rq);
        // preparedCallback && preparedCallback();
        return this;
    };

    /**
     * Send XHR request
     * @param {Function} [finishCallback] - called after all other callbacks
     * @returns {Ajax}
     */
    send(finishCallback) {
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
                ajax.rs = new HttpRs(xhr);
                finishCallback && finishCallback(ajax.rq, ajax.rs, ajax.xhr);
                callback && callback(ajax.rq, ajax.rs, ajax.xhr);
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

        try {
            this.xhr.send(this.rq.content.data);
        } catch (e) {
            this.onFail(e);
        }

        return ajax;
    }

    async sendAsync() {
        const ajax = this;
        const promise = new Promise((res, rej) => {
            ajax.onSuccess(()=>{
                return res(ajax)
            });
            ajax.onFail(()=>rej(ajax));
        });
        ajax.send();
        return promise;
    }
}

module.exports = {Ajax: Ajax};