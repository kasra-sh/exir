require("./request")
require("./response")
X.Ajax = function (method, url, params, headers, content) {
    let self = this;

    // Fields
    self.Rq = new X.HttpRq(method, url, params, headers, content);
    self.Rs = {readyState: 0};
    self.xhr = new XMLHttpRequest();

    // Events
    self.preparedCallback = function (rq) {
        // to be overridden
    };

    self.progressCallback = function (rq, rs) {
        // to be overridden
    };

    self.successCallback = function (rq, rs) {
        // to be overridden
        // console.log('REQUEST:', rq, 'RESPONSE:', rs)
    };

    self.failCallback = function (rq, rs) {
        // to be overridden
        // console.log('REQUEST:', rq, 'RESPONSE:', rs)
    };


    // Methods
    self.header = function (n, v) {
        self.Rq.setHeader(n, v);
        return self;
    };

    self.headers = function (headers) {
        for (let h in headers) {
            if (headers.hasOwnProperty(h))
                self.Rq.setHeader(h, headers[h]);
        }
        return self;
    };

    self.success = function (callbackRqRs) {
        self.successCallback = callbackRqRs;
        return self;
    };

    self.fail = function (callbackRqRs) {
        self.failCallback = callbackRqRs;
        return self;
    };

    self.progress = function(callbackRqRs) {
        self.progressCallback = callbackRqRs;
        return self;
    };

    self.xmlData = function (data) {
        self.Rq.xmlContent(data);
        return self;
    }

    self.formData = function (form) {
        self.Rq.formContent(form);
        return self;
    };

    self.jsonData = function (data) {
        self.Rq.jsonContent(data);
        return self;
    };

    self.urlEncodedData = function (data) {
        self.Rq.formUrlEncodedContent(data);
        return self;
    };

    self.prepare = function (reset) {
        if (self.isPrepared && !reset) {
            // self.onprepare && self.onprepare(self.Rq);
            return self
        }

        // prepare url
        let url = self.Rq.url;
        url.contains('?') || (url += '?');
        url += self.Rq.buildUrlEncoded();
        reset && (self.xhr = new XMLHttpRequest());
        self.xhr.open(self.Rq.method, url);

        // prepare headers
        for (let h in self.Rq.headers) {
            if (self.Rq.headers.hasOwnProperty(h))
            self.xhr.setRequestHeader(h, self.Rq.headers[h]);
        }

        self.isPrepared = true;
        self.preparedCallback && self.preparedCallback(self.Rq);
        // preparedCallback && preparedCallback();
        return self;
    };

    self.send = function (finishCallback) {
        self.prepare();

        self.xhr.onreadystatechange = function (ev) {
            let xhr = ev.target;

            // onloadend
            if (xhr.readyState === 4) {
                let cb;
                if (xhr.status > 0) {
                    cb = self.successCallback;
                } else {
                    cb = self.failCallback;
                }
                self.Rs = new X.HttpRs(xhr);
                finishCallback && finishCallback(self.Rq, self.Rs);
                cb && cb(self.Rq, self.Rs);
            }
        };

        self.xhr.onprogress = function (ev) {
            let xhr = ev.target;
            self.Rs = new X.HttpRs(xhr);
            self.onprogress && self.onprogress(self.Rq, self.Rs);
        };

        self.xhr.send(self.Rq.content.data);

        return self;
    }
};
