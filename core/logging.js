const T = require("./types");
let X = {};
function __logtime__() {
    let t = new Date();
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}:${t.getMilliseconds()}`;
}

function logTitle(flag) {
    return `[${flag}] [${__logtime__()}]`;
}

function prepareLog(args, lt) {
    args.reverse();
    args.push("display: inline-block; font-weight: bold; color: black", "%c"+lt);
    args.reverse();
}

X.Level = T.Enum({TRACE:0, INFO:0, WARN:0, ERROR:0, SILENT:0});
X.LogLevel = X.Level.TRACE;

X.showTrace = function () {X.LogLevel = X.Level.TRACE;}
X.showInfo = function () {X.LogLevel = X.Level.INFO;}
X.showWarn = function () {X.LogLevel = X.Level.WARN;}
X.showError = function () {X.LogLevel = X.Level.ERROR;}
X.silent = function () {X.LogLevel = X.Level.SILENT;}
function lvl(l) {
    return X.LogLevel !== X.Level.SILENT && X.LogLevel <= l
}
X.trace = function (...args) {
    if (!lvl(X.Level.TRACE)) return;
    args.reverse();
    args.push(logTitle("X-TRACE"));
    args.reverse();    // args.push("\n");
    console.trace.apply(X, args);
}

X.info = function (...args) {
    if (!lvl(X.Level.INFO)) return;
    prepareLog(args, logTitle("X-INFO"));
    console.log.apply(X, args);
}

X.warn = function (...args) {
    if (!lvl(X.Level.WARN)) return;
    prepareLog(args, logTitle("X-WARN"));
    console.warn.apply(X, args);
}

X.error = function (...args) {
    if (!lvl(X.Level.ERROR)) return;
    prepareLog(args, logTitle("X-ERROR"));
    console.error.apply(X, args);
}

module.exports = X;