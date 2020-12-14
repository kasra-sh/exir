/**
 * Wrapper class for XHR
 * @module http/ajax
 * @memberOf http
 */
const {HttpRq, HttpContent} = require("./request");
const {HttpRs} = require("./response");
const T = require("../core/types");
const {error} = require("../core/logging");
const {forEach, deepClone} = require("../core/collections");


/**
 * A wrapper class for {@link XMLHttpRequest} to facilitate sending requests and handling events
 * @class
 * @property {Response} rs
 * @property {Request} rq
 */
class Ajax {
    /**
     * @constructor
     * @param {HttpMethod|HttpRq} m - Request method string or {@link http.HttpRq}
     * @param {String} [url]
     * @param {Object} [params] - Request parameters object
     * @param {Object?} [headers] - Headers object
     * @param {HttpContent?} [content] - Optional http content {@link HttpContent}
     */
    constructor(m, url, params = {}, headers = {}, content = new HttpContent()) {
        /** @type {HttpRq}
         * @see {http.HttpRq}
         */
        this.rq = {}
        /** @type {http.HttpRs}
         * @see {http.HttpRs}
         */
        this.rs = {}
        if (m instanceof HttpRq) {
            this.rq = m
        } else {
            this.rq = new HttpRq(m, url, params, headers, content);
        }
        // Fields
        this.rs = {readyState: 0};
        this.xhr = new XMLHttpRequest();

        this.preparedCallback = function (ajax) {
        };

        this.progressCallback = function (ajax, event) {
        };

        this.uploadProgressCallback = function (ajax, event) {
        };

        this.successCallback = function (ajax) {
        };

        this.uploadFinishCallback = function (ajax) {
        };

        this.failCallback = function (ajax, error) {
        };

        this.timeoutCallback = function (ajax) {
        };

        this.abortCallback = function (ajax) {
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
     * @param {Function} callback
     * @returns {Ajax}
     */
    onSuccess(callback) {
        this.successCallback = callback;
        return this;
    };

    /**
     * @param {Function} callback
     * @returns {Ajax}
     */
    onUploadSuccess(callback) {
        this.uploadFinishCallback = callback;
        return this;
    };

    /**
     * @param {Function} callback
     * @returns {Ajax}
     */
    onFail(callback) {
        this.failCallback = callback;
        return this;
    };

    onTimeout(callback) {
        this.timeoutCallback = callback
        return this;
    }

    onAbort(callback) {
        this.abortCallback = callback
        return this;
    }

    /**
     * @param {Function} callback
     * @returns {Ajax}
     */
    onProgress(callback) {
        this.progressCallback = callback;
        return this;
    };

    /**
     * @param {Function} callback
     * @returns {Ajax}
     */
    onUploadProgress(callback) {
        this.uploadProgressCallback = callback;
        return this;
    };

    /**
     * Set custom content {@link HttpContent}
     * @param {HttpContent} content
     * @returns {Ajax}
     */
    withContent(content = {}) {
        switch (content.type) {
            case 'json':
                this.rq.jsonContent(content.data);
                break;
            case 'xml':
                this.rq.xmlContent(content.data);
                break;
            case 'form':
                this.rq.formContent(content.data);
                break;
            case 'form_multipart':
                this.rq.formMultiPartContent(content.data);
                break;
            case 'form_urlencoded':
                this.rq.formUrlEncodedContent(content.data);
                break;
            default:
                this.rq.setContent(content.type, content.data);
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

    prepare(reset) {
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
        this.rs = {readyState: 0};
        reset && (this.xhr = new XMLHttpRequest());
        this.xhr.open(this.rq.method, url);

        // prepare headers
        forEach(this.rq.headers, (val, key)=>{
            try {
                this.xhr.setRequestHeader(key, this.rq.headers[val]);
            } catch (e){
                error('Error while setting default header \n>>(',key,')<< Non-standard header name.')
            }
        })

        let ajax = this;
        let xhr = this.xhr;

        this.xhr.onreadystatechange = function (ev) {
            // onloadend
            if (xhr.readyState === 4 && xhr.status !== 0) {
                let callback = ajax.failCallback;
                if (xhr.status >= 200 && xhr.status <= 399) {
                    callback = ajax.successCallback;
                }
                ajax.rs = new HttpRs(xhr);
                callback && callback(ajax);
            }
        };

        this.xhr.onerror = function (ev) {
            ajax.failCallback && ajax.failCallback(ajax, ev);
        }

        this.xhr.onprogress = function (ev) {
            ajax.progressCallback && ajax.progressCallback(ajax, ev);
        };

        this.xhr.upload.onprogress = function (ev) {
            ajax.uploadProgressCallback && ajax.uploadProgressCallback(ajax, ev);
        };

        this.xhr.upload.onloadend = function (ev) {
            ajax.uploadFinishCallback && ajax.uploadFinishCallback(ajax, ev);
        };

        this.xhr.ontimeout = function (ev) {
            ajax.timeoutCallback && ajax.timeoutCallback(ajax, ev);
        }

        this.xhr.onabort = function (ev) {
            ajax.abortCallback && ajax.abortCallback(ajax, ev);
        }

        this.isPrepared = true;
        this.preparedCallback && this.preparedCallback(this.rq);
        // preparedCallback && preparedCallback();
        return this;
    };

    /**
     * Send XHR request
     * @returns {Ajax}
     */
    send() {
        this.prepare();

        try {
            this.xhr.send(this.rq.content.data);
        } catch (e) {
            this.failCallback(this, e)
        }

        return this;
    }

    resend() {
        return this.prepare(true).send();
    }

    /**
     * Send request with Promise
     * @return {Promise<Ajax>}
     */
    async sendAsync() {
        const ajax = this;
        const promise = new Promise((res, rej) => {
            ajax.onSuccess(() => {
                return res(ajax)
            });
            ajax.onFail(() => {
                rej(ajax)
            });
        });
        ajax.send();
        return promise;
    }
}

module.exports = {Ajax: Ajax};