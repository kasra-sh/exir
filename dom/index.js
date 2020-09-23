const query = require('./query');
const event = require('./event');
const classes = require('./classes');
const attributes = require('./attributes');
const position = require('./position');
const append = require('./append');
const patch = require('./patch');
module.exports = {
    ...query,
    ...event,
    ...classes,
    ...attributes,
    ...position,
    ...append,
    ...patch
};