require("../base");

X.HttpContent = function (type, data) {
    this.type = type;
    this.data = data;
};

X.HttpRq = function (method, url, args, headers, content) {
    let self = this;
    // this.method = this.setMethod(method);
    // this.url = this.setUrl(url);
    self.args = args || {};
    self.headers = headers || {};
    self.content = content || new X.HttpContent('#urlencoded', {});

    self.setMethod = function (m) {
        self.method = m.toUpperCase();
    };

    self.setUrl = function (u) {
        self.url = encodeURI(u);
    };

    self.setMethod(method);

    self.setUrl(url);

    self.setArg = function (n, v) {
        self.args[n] = v;
    };

    self.buildUrlEncoded = function (args) {
        let ue = "";
        args = args || self.args;
        let argNames = Object.getOwnPropertyNames(args);
        if (argNames) {
            for (let i = 0; i < argNames.length; i++) {
                ue += encodeURIComponent(argNames[i]) + '=' + encodeURIComponent(args[argNames[i]]);
                if (i < argNames.length - 1) {
                    ue += '&';
                }
            }
        }
        return ue;
    };

    self.setHeader = function (n, v) {
        self.headers[n] = v.toString();
    };

    self.getHeader = function (n) {
        return self.headers[n];
    };

    self.setContent = function (contentType, data) {
        self.content.type = contentType.toLowerCase();
        self.content.data = data;
    };

    self.jsonContent = function (data) {
        let str = "";
        if (typeof data === "string") {
            str = data;
        } else {
            str = JSON.stringify(data);
        }
        self.setContent('json', str);
        self.setHeader('Content-Type', 'application/json');
    };

    self.xmlContent = function (data) {
        if (X.isStr(data))
            self.setContent('xml', data);
        else self.setContent('xml', data.outerHTML);
        self.setHeader('Content-Type', 'application/xml');
    };

    /**
     *
     * @param form {string} form id
     */
    self.formContent = function (form) {
        //TODO make form data from element id
        let formElement = X.Q1(form);
        let frm = new FormData(formElement);
        self.formMultiPartContent(frm);
    };

    /**
     * @param frm {FormData} custom form data object
     */
    self.formMultiPartContent = function (frm) {
        self.setContent('form_multipart', frm);
        // self.setHeader('Content-Type', 'multipart/form-data; boundary=' + frm.boundary)
    };

    // application/x-www-form-urlencoded
    self.formUrlEncodedContent = function (data) {
        self.setContent('form_urlencoded', self.buildUrlEncoded(data));
        self.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    };

    return self;
};
