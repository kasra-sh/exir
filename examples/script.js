X.Post("http://www.httpbin.org/post", {a: 1})
    .formData("#form")
    .onUploadProgress(function (e) {
        X.info("UPLOAD", (e.loaded * 100 / e.total).toFixed());
    })
    .onProgress(function (e) {
        X.info("DOWNLOAD", (e.loaded * 100 / e.total).toFixed());
    })
    .send(function (rq, rs) {
        X.trace(rs.json)
    });


// var client = new X.XHttpClient('http://conduit.productionready.io/api', {ratePerMinute: 10});
// rq = client.get('articles', {params: {author: "sadaffara"}, responseType: "arrayBuffer", cancelToken: "chiz"}).then((r)=>console.log(r.Rs.data));
// rq = client.get('articles', {params: {author: "sadaffara"}, cancelToken: "chiz"}).then((r)=>console.log(r.Rs.json));