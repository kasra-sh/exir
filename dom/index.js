const query = require('./query');
const event = require('./event');
const classes = require('./classes');
const attributes = require('./attributes');
const position = require('./position');
const append = require('./append');
const patch = require('./patch');
const styles = require('./styles');
module.exports = {
    ...query,
    ...event,
    ...classes,
    ...attributes,
    ...position,
    ...append,
    ...patch,
    ...styles
};
/**
 * @namespace dom
 */