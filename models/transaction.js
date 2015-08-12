/* jshint -W069 */
module.exports = Transaction

/**
 * Snapchat Transaction
 *
 * @param {Object} params
 */
function Transaction (params) {
  var self = this
  if (!(self instanceof Transaction)) return new Transaction(params)

  throw new Error("TODO")
}
