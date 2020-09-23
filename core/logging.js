const T = require("./types");

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

const LogLevels = T.Enum({TRACE:0, INFO:0, WARN:0, ERROR:0, SILENT:0});
const Config = {
    LogLevel : LogLevels.TRACE
}

function showTrace() {Config.LogLevel = LogLevels.TRACE;}
function showInfo() {Config.LogLevel = LogLevels.INFO;}
function showWarn() {Config.LogLevel = LogLevels.WARN;}
function showError() {Config.LogLevel = LogLevels.ERROR;}
function silent() {Config.LogLevel = LogLevels.SILENT;}
function lvl(l) {
    return Config.LogLevel !== LogLevels.SILENT && Config.LogLevel <= l
}
function trace(...args) {
    if (!lvl(LogLevels.TRACE)) return;
    args.reverse();
    args.push(logTitle("X-TRACE"));
    args.reverse();    // args.push("\n");
    console.trace.apply(X, args);
}

function info(...args) {
    if (!lvl(LogLevels.INFO)) return;
    prepareLog(args, logTitle("X-INFO"));
    console.log.apply(X, args);
}

function warn(...args) {
    if (!lvl(LogLevels.WARN)) return;
    prepareLog(args, logTitle("X-WARN"));
    console.warn.apply(X, args);
}

function error(...args) {
    if (!lvl(LogLevels.ERROR)) return;
    prepareLog(args, logTitle("X-ERROR"));
    console.error.apply(X, args);
}

module.exports = {
    Config,
    LogLevels,
    showTrace, showInfo, showWarn, showError, silent, trace, info, warn, error
};