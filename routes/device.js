module.exports = Device

var debug = require('debug')('snapchat:device')

var StringUtils = require('../lib/string-utils')

/**
 * Snapchat wrapper for chat-related API calls.
 *
 * @param {Object} opts
 */
function Device (client, opts) {
  var self = this
  if (!(self instanceof Device)) return new Device(client, opts)
  if (!opts) opts = {}

  self.client = client
}

/**
 * Sends the "app did open" event to Snapchat.
 *
 * @param {function} cb
 */
Device.prototype.sendDidOpenAppEvent = function (cb) {
}

/**
 * Sends the "app did close" event to Snapchat.
 *
 * @param {function} cb
 */
Device.prototype.sendDidCloseAppEvent = function (cb) {
}
