module.exports = NearbyUser

/**
 * Snapchat NearbyUser
 */
function NearbyUser (username, identifier) {
  var self = this
  if (!(self instanceof NearbyUser)) return new NearbyUser(username, identifier)

  self.username = username
  self.identifier = identifier
}
