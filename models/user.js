/* jshint -W069 */
module.exports = User

/**
 * Snapchat User
 *
 * @param {Object} params
 */
function User (params) {
  var self = this
  if (!(self instanceof User)) return new User(params)

  self.friendmoji = params['friendmoji_string']
  self.venue = params['venue'] || ''
  self.sharedStoryIdentifier = params['shared_story_id'] || ''
  self.canSeeCustomStories = !!params['can_see_custom_stories']
  self.needsLove = !!params['needs_love']
  self.isSharedStory = !!params['is_shared_story']
  self.isLocalStory = !!params['local_story']
  self.hasCustomDescription = !!params['has_custom_description']
  self.decayThumbnail = !!params['dont_decay_thumbnail']

  if (params['ts']) {
    self.timestamp = new Date(params['ts'])
  }
}
