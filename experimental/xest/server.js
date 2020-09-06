const http = require('http');
const fs = require('fs');
const path = require('path')
const {open} = require("../open");
const hostname = '127.0.0.1';
let tests = [];
function getPage() {
    const tst = tests.map((t)=>{
        return `<script>${t.text}</script>`
    }).join('\n');
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Xest</title>
<script src="xest.js"></script>
</head>
<body style="width: 50%; margin: auto; text-align: center">
Running tests ...
${tst}
</body>
</html>
`
}

const server = http.createServer((req, res) => {
    if (req.url.indexOf('xest.js')>=0) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/javascript');
        // noinspection JSUnresolvedFunction
        res.end(fs.readFileSync('xest.js'));
    } else {
        let idx = tests.findIndex((t)=>t.name.indexOf(req.url)===1)
        if (idx>=0) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/javascript');
            res.end(tests[idx].text);
        } else {
            console.log(dir);
            let p = path.join(dir, req.url)
            console.log(p)
            if (fs.existsSync(p) && !fs.lstatSync(p).isDirectory()) {
                res.statusCode = 200;
                let ext = path.extname(p);
                if (ext === 'js') ext = 'javascript';
                console.log(ext);
                res.setHeader('Content-Type', `text/${ext}`);
                res.end(fs.readFileSync(p).toString());
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                // noinspection JSUnresolvedFunction
                res.end(getPage());
            }

        }
    }

});

let files = process.argv.slice(2);

if (fs.lstatSync(files[0]).isDirectory()) {
    var dir = files[0];
    files = fs.readdirSync(files[0]);
    console.log(files);
    files.forEach((fname, index)=>{
        tests.push({name: fname, text: fs.readFileSync(path.resolve(dir,fname))})
    });
}



server.listen(0, hostname, () => {
    console.log(`Server running at http://${hostname}:${server.address().port}/`);
    open(`http://${hostname}:${server.address().port}/`)
});

module.exports = {server};