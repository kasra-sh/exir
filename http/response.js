/**
 * Http Response class
 * @property json {Object}
 * @property xml {XMLDocument}
 *
 */
class HttpRs {
    json
    xml

    /**
     * @constructor
     * @param {XMLHttpRequest} xhr
     */
    constructor(xhr) {
        this.xhr = xhr
        this.status = {
            code: xhr.status,
            text: xhr.statusText
        };
        this.headers = xhr.getAllResponseHeaders();
        this.contentLength = xhr.response.length || 0;
        this.data = xhr.response;
        if (xhr.responseType === 'text' || xhr.responseType === '')
            this.text = xhr.responseText;
        Object.defineProperty(this, 'json', {
            get() {
                try {
                    if (!xhr.responseJSON) {
                        xhr.responseJSON = JSON.parse(this.xhr.responseText);
                    }
                } catch (e) {
                    console.log(e);
                }
                return xhr.responseJSON
            }
        });

        Object.defineProperty(this, 'xml', {
            get() {
                try {
                    if (!xhr.responseXML) {
                        let parser = new DOMParser();
                        xhr.responseXML = parser.parseFromString(self.text,"text/xml");
                    }
                }catch (e) {
                    console.log(e)
                }

                return xhr.responseXML;
            }
        })
    }

}
module.exports = {HttpRs};