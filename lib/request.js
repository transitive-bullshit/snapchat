module.exports = Request

var debug = require('debug')('snapchat:request')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(Request, EventEmitter)

/**
 * Snapchat Request
 *
 * @param {Object} opts
 */
function Request (opts) {
  var self = this
  if (!(self instanceof Request)) return new Request(opts)
  if (!opts) opts = {}
  EventEmitter.call(self)

  debug('new snapchat request')
}
