X.showTrace();
var o1 = {
    a: 5,
    b: {
        a: 44,
        b: 55
    },
    c: null
}
var o2 = {
    a1: 67,
    a: 5,
    b: {
        a: 44,
        b: 55
    },
    d: 8234
};

X.setEvent(X.$("#form>button"), "click", function () {
    X.Post("http://www.httpbin.org/post", {a: 1})
        .formData("#form")
        .uploadProgress(function (e) {
            X.info("UPLOAD", (e.loaded * 100 / e.total).toFixed());
        })
        .progress(function (e) {
            X.info("DOWNLOAD", (e.loaded * 100 / e.total).toFixed());
        })
        .send(function (rq, rs) {
            X.trace(rs.json())
        });
});
// this listener replaces previous one
X.event(X.$$("#form>button"), "click", function () {
    R.Post("http://www.httpbin.org/post", {a: 1})
        .formData("#form")
        .onUploadProgress(function (e) {
            X.info("UPLOAD", (e.loaded * 100 / e.total).toFixed());
        })
        .onProgress(function (e) {
            X.info("DOWNLOAD", (e.loaded * 100 / e.total).toFixed());
        })
        .send(function (rq, rs) {
            X.trace(rs.json())
        });
});
