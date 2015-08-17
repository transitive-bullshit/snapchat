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

  // The username of the user associated with this story collection.
  self.username = params['username']
  // Whether this story contains explicit content.
  self.matureContent = !!params['mature_content']

  // Only applies to shared stories.
  self.adPlacementData = params['ad_placement_metadata']
  // The display name of the shared story. (shared only)
  self.displayName = params['display_name']
  // The identifier of the shared story. (shared only)
  self.sharedIdentifier = params['shared_id']
  // Whether the shared story is local or not. (shared only)
  self.isLocal = !!params['is_local']

  // Only applies to shared stories.
  if (thumbs) {
    // The thumbnail for the viewed state of the story.
    self.viewedThumbnail = thumbs['viewed']['url']
    // The thumbnail for the unviewed state of the story.
    self.unviewedThumbnail = thumbs['unviewed']['url']

    self.viewedThumbnailNeedsAuth = !!thumbs['viewed']['needs_auth']
    self.unviewedThumbnailNeedsAuth = !!thumbs['unviewed']['needs_auth']
  }

  // An array of Story objects.
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
