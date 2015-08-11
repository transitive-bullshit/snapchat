module.exports = Snapchat

var debug = require('debug')('snapchat')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(Snapchat, EventEmitter)

/**
 * Snapchat Client
 * @param {Object} opts
 */
function Snapchat (opts) {
  var self = this
  if (!(self instanceof Snapchat)) return new Snapchat(opts)
  if (!opts) opts = {}
  EventEmitter.call(self)

  debug('new snapchat client (username %s)', self.username)
}
