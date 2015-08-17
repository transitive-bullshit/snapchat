/* jshint -W069 */
module.exports = SharedStoryDescription

/**
 * Snapchat SharedStoryDescription
 *
 * @param {Object} params
 */
function SharedStoryDescription (params) {
  var self = this
  if (!(self instanceof SharedStoryDescription)) return new SharedStoryDescription(params)

  // ie "Campaign 2016 is a collection of Snaps from Snapchatters in Iowa."
  self.friendNote = params['FRIEND']

  // ie "While you're here, you may submit Snaps to Our Campaign Story. To opt out of this location-based feature, turn off Filters in Settings."
  self.localPostBody = params['LOCAL_POST_BODY']

  // ie "Post Snap to Campaign?"
  self.localPostTitle = params['LOCAL_POST_TITLE']

  // ie "Campaign 2016 is a collection of Snaps from Snapchatters in Iowa."
  self.localViewBody = params['LOCAL_VIEW_BODY']

  // ie "Our Story"
  self.localViewTitle = params['LOCAL_VIEW_TITLE']
}
