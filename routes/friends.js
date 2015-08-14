module.exports = Friends

var debug = require('debug')('snapchat:friends')

var StringUtils = require('../lib/string-utils')

/**
 * Snapchat wrapper for friends-related API calls.
 *
 * @param {Object} opts
 */
function Friends (client, opts) {
  var self = this
  if (!(self instanceof Friends)) return new Friends(client, opts)
  if (!opts) opts = {}

  self.client = client
}

/**
 * Adds the users in \e toAdd as friends, and unfriends the users in \e toUnfriend.
 *
 * @param toAdd An array of username strings of users to add. Doesn't matter if they're already in your friends.
 * @param toUnfriend An array of username strings of users to un-friend. Doesn't matter if they're not already in your friends.
 * @param {function} cb
 */
Snapchat.prototype.addFriends = function (toAdd, toUnfriend, cb) {
}

/**
 * Adds \c username as a friend.
 *
 * @param username The user to add.
 * @param {function} cb
 */
Snapchat.prototype.addFriend = function (username, cb) {
}

/**
 * Use this to add back a user who has added you as a friend. Sort of like accepting a friend request.
 *
 * @discussion This only affects the "added by" string the other user will see.
 * @param username The username of the user user to add back.
 * @param {function} cb
 */
Snapchat.prototype.addFriendBack = function (username, cb) {
}

/**
 * Unfriends \c username.
 *
 * @param username The username of the user to unfriend.
 * @param {function} cb
 */
Snapchat.prototype.unfriend = function (username, cb) {
}

/**
 * Finds friends given phone numbers and names.
 *
 * @discussion \c friends is a number->name map, where "name" is the desired screen name of that friend and "number" is their phone number.
 * The names given will be used as display names for any usernames found.
 * @param friends a dictionary with phone number strings as the keys and name strings as the values.
 * @param {function} cb
 */
Snapchat.prototype.findFriends = function (friends, cb) {
}

/**
 * Finds nearby snapchatters who are also looking for nearby snapchatters.
 *
 * @param location The location to search from.
 * @param accuracy The radius in meters to find nearby snapchatters at \c location. Defaults to \c 10.
 * @param milliseconds The total poll duration so far. If you're polling in a for-loop for example, pass the time in milliseconds since you started polling. This has been guess-work, but I think it's right.
 * @param {function} cb
 */
Snapchat.prototype.findFriendsNear = function (location, accuracy, milliseconds, cb) {
}

/**
 * Not sure what this is for.
 */
Snapchat.prototype.searchFriend = function (query, cb) {
}

/**
 * Checks to see whether \c username is a registered username.
 *
 * @param {function} cb
 */
Snapchat.prototype.userExists = function (username, cb) {
}

/**
 * Updates the display name for one of your friends.
 *
 * @param friend The username to give the new display name to.
 * @param displayName The new display name.
 * @param {function} cb
 */
Snapchat.prototype.updateDisplayNameForUser = function (friend, displayName, cb) {
}

/**
 * Blocks \c username.
 *
 * @param username The username of the user to block.
 * @param {function} cb
 */
Snapchat.prototype.blockUser = function (username, cb) {
}

/**
 * This appears to be for an upcoming feature: suggested friends?
 *
 * @param usernames I assume this is for usernames; it's always been empty.
 * @param seen Whether to mark as seen.
 * @param {function} cb
 */
Snapchat.prototype.seenSuggestedFriends = function (usernames, seen, cb) {
}
