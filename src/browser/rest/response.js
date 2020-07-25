require("../base");

X.HttpRs = function (xhr) {
    this.xhr = xhr;
    let self = this;
    self.status = {
        code: xhr.status,
        text: xhr.statusText
    };

    self.headers = xhr.getAllResponseHeaders();

    self.contentLength = xhr.response.length || 0;

    self.data = xhr.response;

    self.text = xhr.responseText;

    self.json = function () {
        if (!xhr.responseJSON) {
            xhr.responseJSON = JSON.parse(xhr.responseText);
        }
        return xhr.responseJSON
    }

    self.xml = function() {
        if (!xhr.responseXML) {
            let parser = new DOMParser();
            xhr.responseXML = parser.parseFromString(self.text,"text/xml");
        }
        return xhr.responseXML;
    };
};
