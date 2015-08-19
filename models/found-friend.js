module.exports = FoundFriend

/**
 * Snapchat FoundFriend
 *
 * @class
 *
 * @param {Object} params
 */
function FoundFriend (params) {
  var self = this
  if (!(self instanceof FoundFriend)) return new FoundFriend(params)

  self.displayName = params['display']
  self.username = params['name']
  self.isPrivate = !!params['type']
}
