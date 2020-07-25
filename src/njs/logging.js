require("../scope");
require("./types");
function __logtime__() {
    let t = new Date();
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}:${t.getMilliseconds()}`;
}
function preLog(flag) {
    return `[${flag}] [${__logtime__()}]`;
}

X.LogLevels = X.Enum(["TRACE", "INFO", "WARN", "ERROR", "SILENT"]);
X.LogLevel = X.LogLevels.TRACE;

X.LogTrace = function () {X.LogLevel = X.LogLevels.TRACE;}
X.LogInfo = function () {X.LogLevel = X.LogLevels.INFO;}
X.LogWarn = function () {X.LogLevel = X.LogLevels.WARN;}
X.LogError = function () {X.LogLevel = X.LogLevels.ERROR;}

function lvl(l) {
    return X.LogLevel !== X.LogLevels.SILENT && X.LogLevel <= l
}

X.trace = function (...args) {
    if (!lvl(X.LogLevels.TRACE)) return;
    args.reverse().push(preLog("X-TRACE"));
    console.trace.apply(X, args.reverse());
}

X.info = function (...args) {
    if (!lvl(X.LogLevels.INFO)) return;
    args.reverse().push(preLog("X-INFO"));
    console.log.apply(X, args.reverse());
}

X.warn = function (...args) {
    if (!lvl(X.LogLevels.WARN)) return;
    args.reverse().push(preLog("X-WARN"));
    console.warn.apply(X, args.reverse());
}

X.error = function (...args) {
    if (!lvl(X.LogLevels.ERROR)) return;
    args.reverse().push(preLog("X-ERROR"));
    console.error.apply(X, args.reverse());
}