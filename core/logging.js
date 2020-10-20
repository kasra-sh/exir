const {Enum} = require("./types");

/**
 * @module core/logging
 * @memberOf core
 */

/** @private */
function _logTime() {
    let t = new Date();
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}:${t.getMilliseconds()}`;
}

/** @private */
function _logTitle(flag) {
    return `[${flag}] [${_logTime()}]`;
}

/** @private */
function _prepareLog(args, lt) {
    args.reverse();
    args.push("display: inline-block; font-weight: bold; color: black", "%c"+lt);
    args.reverse();
}

/**
 * @type {Object}
 */
const LogLevels = {TRACE:0, INFO:0, WARN:0, ERROR:0, SILENT:0};
/**
 * Log config
 * @type {{LogLevel: *}}
 */
const Config = {
    LogLevel : LogLevels.TRACE
}

/** Set `Config.LogLevel` to TRACE */
function showTrace() {Config.LogLevel = LogLevels.TRACE;}

/** Set `Config.LogLevel` to INFO */
function showInfo() {Config.LogLevel = LogLevels.INFO;}

/** Set `Config.LogLevel` to WARN */
function showWarn() {Config.LogLevel = LogLevels.WARN;}

/** Set `Config.LogLevel` to ERROR */
function showError() {Config.LogLevel = LogLevels.ERROR;}

/** Set `Config.LogLevel` to SILENT */
function silent() {Config.LogLevel = LogLevels.SILENT;}

/** Set Config.LogLevel
 * @param l - LogLevel */
function lvl(l) {
    return Config.LogLevel !== LogLevels.SILENT && Config.LogLevel <= l
}

/**
 * Log Trace
 * @param {any} args
 */
function trace(...args) {
    if (!lvl(LogLevels.TRACE)) return;
    args.reverse();
    args.push(_logTitle("X-TRACE"));
    args.reverse();    // args.push("\n");
    console.trace.apply(this, args);
}
/**
 * Log Info
 * @param {any} args
 */
function info(...args) {
    if (!lvl(LogLevels.INFO)) return;
    _prepareLog(args, _logTitle("X-INFO"));
    console.log.apply(this, args);
}
/**
 * Log Warning
 * @param {any} args
 */
function warn(...args) {
    if (!lvl(LogLevels.WARN)) return;
    _prepareLog(args, _logTitle("X-WARN"));
    console.warn.apply(this, args);
}
/**
 * Log Error
 * @param {any} args
 */
function error(...args) {
    if (!lvl(LogLevels.ERROR)) return;
    _prepareLog(args, _logTitle("X-ERROR"));
    console.error.apply(this, args);
}

module.exports = {
    Config,
    LogLevels,
    showTrace, showInfo, showWarn, showError, silent, trace, info, warn, error
};