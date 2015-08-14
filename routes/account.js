module.exports = Account

var debug = require('debug')('snapchat:account')

var constants = require('./constants')

/**
 * Snapchat wrapper for account-related API calls.
 *
 * @param {Object} opts
 */
function Account (client, opts) {
  var self = this
  if (!(self instanceof Account)) return new Account(client, opts)
  if (!opts) opts = {}

  self.client = client
}

/**
 * Updates the number of best friends to display.
 *
 * @param number A number from 3 to 7. Defaults to 3 and will max out at 7.
 * @param {function} cb
 */
Account.prototype.updateBestFriendsCount = function (number, cb) {
}

/**
 * Updates who can send you snaps.
 *
 * @param privacy \c SKSnapPrivacyFriends or \c SKSnapPrivacyEveryone. Defaults to \c SKSnapPrivacyFriends.
 * @param {function} cb
 */
Account.prototype.updateSnapPrivacy = function (privacy, cb) {
}

/**
 * Updates who can see your stories. \e friends is only necessary when using \c SKStoryPrivacyCustom.
 *
 * @warning Passing invalid values to \e privacy raises an exception.
 * @param privacy \c SKStoryPrivacyEveryone, \c SKStoryPrivacyFriends, \c SKStoryPrivacyCustom.
 * @param friends  A list of strings of usernames to hide your stories from. Used only when \c privacy is \c SKStoryPrivacyCustom. You may pass \c nil for this parameter.
 * @param {function} cb
 */
Account.prototype.updateStoryPrivacy = function (privacy, friends, cb) {
}

/**
 * Updates your account's email address.
 *
 * @param address Your new email address.
 * @param {function} cb
 */
Account.prototype.updateEmail = function (address, cb) {
}

/**
 * Updates whether your account can be found with your phone number.
 *
 * @param searchable The new value for this preference.
 * @param {function} cb
 */
Account.prototype.updateSearchableByNumber = function (cb) {
}

/**
 * Updates your "notification sounds" preference.
 *
 * @param enableSound The new value for this preference.
 * @param {function} cb
 */
Account.prototype.updateNotificationSoundSetting = function (enableSound, cb) {
}

/**
 * Updates your display name.
 *
 * @discussion Your "display name" is what your contact name defaults to when someone new adds you, not your username.
 * @param displayName Your new display name.
 * @param {function} cb
 */
Account.prototype.updateDisplayName = function (displayName, cb) {
}

/**
 * Updates your account's feature settings.
 *
 * @discussion See the \c SKFeature string constants in \c SnapchatKit-Constants.h for valid keys. Invalid keys will be silently ignored.
 * @param settings A dictionary of string-boolean pairs. Missing keys-value pairs default to the current values. Behavior is undefined for values other than @YES and @NO.
 * @warning Raises an exception if \e settings contains more than 8 key-value pairs.
 * @param {function} cb
 */
Account.prototype.updateFeatureSettings = function (settings, cb) {
}

/**
 * Downloads your account's snaptag, a personal Snapchat QR code.
 *
 * @param {function} cb
 */
Account.prototype.downloadSnaptag = function (cb) {
}

/**
 * Uploads a new animated avatar. Not working yet.
 *
 * @param datas An array of 5 image \c NSData objects.
 * @param {function} cb
 */
Account.prototype.uploadAvatar = function (dates, cb) {
}

/**
 * Downloads the animated avatar for \c user. Currently encrypted, or something.
 *
 * @param username The username tied to the avatar to download.
 * @param {function} cb
 */
Account.prototype.downloadAvatar = function (username, cb) {
}

/**
 * Updates your TOS agreement status for each of the three Terms of Service's.
 *
 * @param {function} cb
 */
Account.prototype.updateTOSAgreementStatus = function (snapcash, snapcashv2, square, cb) {
}
