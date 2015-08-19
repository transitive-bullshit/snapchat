module.exports = SnapOptions

/**
 * Snapchat SnapOptions
 *
 * @class
 *
 * @param {Array<string>} recipients An array of username strings.
 * @param {string} text The text sent in the snap.
 * @param {number=} timer Optional length of the snap. Defaults to 3
 */
function SnapOptions (recipients, text, timer) {
  var self = this
  if (!(self instanceof SnapOptions)) return new SnapOptions(recipients, text, timer)

  self.recipients = recipients
  self.text = text
  self.timer = timer || 3
}
