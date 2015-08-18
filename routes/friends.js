module.exports = Friends

var debug = require('debug')('snapchat:friends')

var constants = require('../lib/constants')

var FoundFriend = require('../models/found-friend')
var NearbyUser = require('../models/nearby-user')
var User = require('../models/user')

/**
 * Friends wrapper for friends-related API calls.
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
 * @param {Array[string]} toAdd An array of username strings of users to add. Doesn't matter if they're already in your friends.
 * @param {Array[string]} toUnfriend An array of username strings of users to un-friend. Doesn't matter if they're not already in your friends.
 * @param {function} cb
 */
Friends.prototype.addFriends = function (toAdd, toUnfriend, cb) {
  var self = this
  debug('Friends.addFriends (toAdd %j, toUnfriend %j)', toAdd, toUnfriend)

  if (!toAdd) toAdd = []
  if (!toUnfriend) toUnfriend = []

  self.client.post(constants.endpoints.friends.friend, {
    'username': self.client.username,
    'action': 'multiadddelete',
    'friend': {
      friendsToAdd: toAdd,
      friendsToDelete: toUnfriend
    },
    'added_by': 'ADDED_BY_USERNAME'
  }, cb)
}

/**
 * Adds \c username as a friend.
 *
 * @param {string} username The user to add.
 * @param {function} cb
 */
Friends.prototype.addFriend = function (username, cb) {
  var self = this
  debug('Friends.addFriend (%s)', username)

  self.client.post(constants.endpoints.friends.friend, {
    'action': 'add',
    'friend': username,
    'username': self.client.username,
    'added_by': 'ADDED_BY_USERNAME'
  }, cb)
}

/**
 * Use this to add back a user who has added you as a friend. Sort of like accepting a friend request.
 *
 * @discussion This only affects the "added by" string the other user will see.
 * @param {string} username The username of the user user to add back.
 * @param {function} cb
 */
Friends.prototype.addFriendBack = function (username, cb) {
  var self = this
  debug('Friends.addFriendBack (%s)', username)

  self.client.post(constants.endpoints.friends.friend, {
    'action': 'add',
    'friend': username,
    'username': self.client.username,
    'added_by': 'ADDED_BY_ADDED_ME_BACK'
  }, cb)
}

/**
 * Unfriends \c username.
 *
 * @param {string} username The username of the user to unfriend.
 * @param {function} cb
 */
Friends.prototype.unfriend = function (username, cb) {
  var self = this
  debug('Friends.unfriend (%s)', username)

  self.client.post(constants.endpoints.friends.friend, {
    'action': 'delete',
    'friend': username,
    'username': self.client.username
  }, function (err) {
    if (err) {
      return cb(err)
    }

    self._removeFriendsFromSession([ { username: username } ])
    cb(null)
  })
}

/**
 * Finds friends given phone numbers and names.
 *
 * @discussion \c friends is a number->name map, where "name" is the desired screen name of that friend and "number" is their phone number.
 * The names given will be used as display names for any usernames found.
 * @param {Object} friends a dictionary with phone number strings as the keys and name strings as the values.
 * @param {function} cb
 */
Friends.prototype.findFriends = function (friends, cb) {
  var self = this
  debug('Friends.findFriends (%j)', friends)

  if (self.client.currentSession.shouldTextToVerifyNumber ||
      self.client.curentSession.shouldCallToVerifyNumber) {
    return cb('Friends.findFriends error client needs to verify phone first')
  }

  self.client.post(constants.endpoints.friends.find, {
    'username': self.client.username,
    'countryCode': self.client.currentSession.countryCode,
    'numbers': friends
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result && result.results) {
      return cb(null, result.results.map(function (friend) {
        return new FoundFriend(friend)
      }))
    }

    cb('Friends.findFriends parse error')
  })
}

/**
 * Finds nearby snapchatters who are also looking for nearby snapchatters.
 *
 * @param {Object} location The location to search from { lat, lng }.
 * @param {number} accuracy The radius in meters to find nearby snapchatters at \c location. Defaults to \c 10.
 * @param {number} milliseconds The total poll duration so far. If you're polling in a for-loop for example, pass the time in milliseconds since you started polling. This has been guess-work, but I think it's right.
 * @param {function} cb
 */
Friends.prototype.findFriendsNear = function (location, accuracy, milliseconds, cb) {
  var self = this
  debug('Friends.findFriendsNear')

  if (accuracy <= 0) accuracy = 10

  self.client.post(constants.endpoints.friends.findNearby, {
    'username': self.client.username,
    'accuracyMeters': accuracy,
    'action': 'update',
    'lat': location.lat,
    'lng': location.lng,
    'totalPollingDurationMillis': milliseconds
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result && result['nearby_snapchatters']) {
      return cb(null, result['nearby_snapchatters'].map(function (user) {
        return new NearbyUser(user['username'], user['user_id'])
      }))
    }

    cb('Friends.findFriendNear parse error')
  })
}

/**
 * Not sure what this is for.
 */
Friends.prototype.searchFriend = function (query, cb) {
  var self = this
  debug('Friends.searchFriend (%s)', query)

  self.client.post(constants.endpoints.friends.search, {
    'query': query,
    'username': self.client.username
  }, cb)
}

/**
 * Checks to see whether \c username is a registered username.
 *
 * @param {string} username
 * @param {function} cb
 */
Friends.prototype.userExists = function (username, cb) {
  var self = this
  debug('Friends.userExists (%s)', username)

  self.client.post(constants.endpoints.friends.search, {
    'request_username': username,
    'username': self.client.username
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result) {
      return cb(null, !!result.exists)
    }

    cb('Friends.userExists parse error')
  })
}

/**
 * Updates the display name for one of your friends.
 *
 * @param {string} friend The username to give the new display name to.
 * @param {string} displayName The new display name.
 * @param {function} cb
 */
Friends.prototype.updateDisplayNameForUser = function (friend, displayName, cb) {
  var self = this
  debug('Friends.updateDisplayNameForUser (%s, %s)', friend, displayName)

  self.client.post(constants.endpoints.friends.friend, {
    'action': 'display',
    'display': displayName,
    'friend': friend,
    'friend_id': '',
    'username': self.client.username
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result && result.object) {
      var updated = new User(result.object)

      self._removeFriendsFromSession([ updated ])
      self._addFriendsToSession([ updated ])
      return cb(null, updated)
    }

    cb('Friends.updateDisplayNameForUser parse error')
  })
}

/**
 * Blocks \c username.
 *
 * @param {string} username The username of the user to block.
 * @param {function} cb
 */
Friends.prototype.blockUser = function (username, cb) {
  var self = this
  debug('Friends.blockUser (%s)', username)

  self._setUserBlocked(username, true, cb)
}

/**
 * Unblocks \c username.
 *
 * @param {string} username The username of the user to block.
 * @param {function} cb
 */
Friends.prototype.unblockUser = function (username, cb) {
  var self = this
  debug('Friends.unblockUser (%s)', username)

  self._setUserBlocked(username, false, cb)
}

/**
 * This appears to be for an upcoming feature: suggested friends?
 *
 * @param {Array[string]} usernames.
 * @param {boolean} seen Whether to mark as seen.
 * @param {function} cb
 */
Friends.prototype.seenSuggestedFriends = function (usernames, seen, cb) {
  var self = this
  debug('Friends.seenSuggestedFriends (%j, %d)', usernames, seen)

  if (!usernames || !usernames.length) usernames = [ ]

  self.client.post(constants.endpoints.misc.suggestFriend, {
    'action': 'update',
    'seen': !!seen,
    'seen_suggested_friend_list': usernames,
    'username': self.client.username
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result) {
      return cb(null, !!result.logged)
    }

    cb('Friends.seenSuggestedFriends parse error')
  })
}

/**
 * @internal
 *
 * @param {Array[User]} friends
 */
Friends.prototype._removeFriendsFromSession = function (friends) {
  var self = this
  var friendsMap = { }

  friends.forEach(function (friend) {
    friendsMap[friend.username] = true
  })

  self.client.currentSession.friends = self.client.currentSession.friends.filter(function (friend) {
    return !(friend.username in friendsMap)
  })
}

/**
 * @internal
 *
 * @param {Array[User]} friends
 */
Friends.prototype._addFriendsToSession = function (friends) {
  var self = this
  self.client.currentSession.friends = self.client.currentSession.friends.concat(friends)
}

/**
 * @internal
 *
 * @param {string} username
 * @param {boolean} blocked
 * @param {function} cb
 */
Friends.prototype._setUserBlocked = function (username, blocked, cb) {
  var self = this

  self.client.post(constants.endpoints.friends.friend, {
    'action': blocked ? 'block' : 'unblock',
    'friend': username,
    'username': self.client.username
  }, cb)
}
