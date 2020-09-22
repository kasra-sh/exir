require("../core/types");
class HttpRs {
    json
    xml
    constructor(xhr) {
        this.xhr = xhr
        this.status = {
            code: xhr.status,
            text: xhr.statusText
        };
        this.headers = xhr.getAllResponseHeaders();
        this.contentLength = xhr.response.length || 0;
        this.data = xhr.response;
        this.text = xhr.responseText;
        Object.defineProperty(this, 'json', {
            get() {
                if (!this.xhr.responseJSON) {
                    this.xhr.responseJSON = JSON.parse(this.xhr.responseText);
                }
                return this.xhr.responseJSON
            }
        });

        Object.defineProperty(this, 'xml', {
            get() {
                if (!this.xhr.responseXML) {
                    let parser = new DOMParser();
                    this.xhr.responseXML = parser.parseFromString(self.text,"text/xml");
                }
                return this.xhr.responseXML;
            }
        })
    }

}
module.exports = {HttpRs};