const { DEBUG } = require('./constants')

/* eslint-disable no-console */
const debug = DEBUG ? console.log.bind(console, '[DEBUG]') : () => {}
const log = console.log.bind(console)
const error = console.error.bind(console, '[!ERROR]')
/* eslint-enable no-console */

module.exports = { log, debug, error }
