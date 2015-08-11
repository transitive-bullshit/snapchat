module.exports = Session

var debug = require('debug')('snapchat:session')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(Session, EventEmitter)

/**
 * Snapchat Session
 *
 * @param {Object} opts
 */
function Session (opts) {
  var self = this
  if (!(self instanceof Session)) return new Session(opts)
  if (!opts) opts = {}
  EventEmitter.call(self)

  debug('new snapchat session')
}
