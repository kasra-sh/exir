require(require("../ext-generate.js").file);
const Log = require("../core/logging")
// Log.silent();
Log.error("Err");
Log.info({a:4, b:6, c:{a:5, b:6}}.$filter({a: 5}));
