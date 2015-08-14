module.exports = Snaps

var debug = require('debug')('snapchat:snaps')

var StringUtils = require('../lib/string-utils')

/**
 * Snapchat wrapper for friends-related API calls.
 *
 * @param {Object} opts
 */
function Snaps (client, opts) {
  var self = this
  if (!(self instanceof Snaps)) return new Snaps(client, opts)
  if (!opts) opts = {}

  self.client = client
}

/**
 * Sends a snap with the given options.
 *
 * @param blob The \c SKBlob object containing the image or video data to send. Can be created with any \c NSData object.
 * @param opts The options for the snap to be sent.
 * @param {function} cb
 */
Snaps.prototype.sendSnap = function (blob, opts, cb) {
}

/**
 * Sends a snap to everyone in \c recipients with text \c text for \c duration seconds.
 *
 * @param blob The \c SKBlob object containing the image or video data to send. Can be created with any \c NSData object.
 * @param recipients An array of username strings.
 * @param text The text to label the snap with. This text is not superimposed upon the image; you must do that yourself.
 * @param duration The legnth of the snap. It must be greater than \c 0 or an exception will be raised.
 * @param {function} cb
 */
Snaps.prototype.sendSnap2 = function (blob, recipients, text, duration, cb) {
}

/**
 * Marks a snap as opened for \c secondsViewed seconds.
 *
 * @param secondsViewed The number of seconds the snap was viewed for.
 * @param {function} cb
 */
Snaps.prototype.markSnapViewed = function (snap, secondsViewed, cb) {
}

/**
 * Marks a set of snaps as opened for the specified length at the given times.
 *
 * @param snaps An array of \c SKSnap objects.
 * @param times An array of \c NSDate objects.
 * @param secondsViewed An array of \c NSNumber objects. Try to use floating point nubmers.
 * @param {function} cb
 */
Snaps.prototype.markSnapsViewed = function (snaps, times, secondsViewed, cb) {
}

/**
 * Marks a snap as screenshotted and viewed for \c secondsViewed seconds.
 *
 * @param secondsViewed The number of seconds the snap was viewed for.
 * @param {function} cb
 */
Snaps.prototype.markSnapScreenshot = function (snap, secondsViewed, cb) {
}

/**
 * Loads a snap.
 *
 * @param {function} cb
 */
Snaps.prototype.loadSnap = function (snap, cb) {
}

/**
 * Loads filters for a location.
 *
 * @param {function} cb
 */
Snaps.prototype.loadFiltersForLocation = function (location, cb) {
}
