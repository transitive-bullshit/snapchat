/* jshint -W069 */
module.exports = Message

/**
 * Snapchat Message
 *
 * @param {Object} params
 */
function Message (params) {
  var self = this
  if (!(self instanceof Message)) return new Message(params)

  throw new Error("TODO")
}
