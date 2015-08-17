module.exports = StoryCollection

var Story = require('./story')

/**
 * Snapchat StoryCollection
 *
 * @param {Object} params
 */
function StoryCollection (params) {
  var self = this
  if (!(self instanceof StoryCollection)) return new StoryCollection(params)

  var thumbs = params['thumbnails']

  self.username = params['username']
  self.matureContent = !!params['mature_content']
  self.adPlacementData = params['ad_placement_metadata']

  self.displayName = params['display_name']
  self.sharedIdentifier = params['shared_id']
  self.isLocal = !!params['is_local']

  if (thumbs) {
    self.viewedThumbnail = thumbs['viewed']['url']
    self.unviewedThumbnail = thumbs['unviewed']['url']

    self.viewedThumbnailNeedsAuth = !!thumbs['viewed']['needs_auth']
    self.unviewedThumbnailNeedsAuth = !!thumbs['unviewed']['needs_auth']
  }

  self.stories = (params.stories || [ ]).map(function (story) {
    return new Story(story)
  })
}

/**
 * Whether or not the stories in this collection are shared.
 *
 * @type {boolean}
 */
Object.defineProperty(StoryCollection.prototype, 'isSharedStory', {
  get: function () {
    return this.stories[0] && this.stories[0].shared
  }
})
