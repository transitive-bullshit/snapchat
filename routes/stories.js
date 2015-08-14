module.exports = Stories

var debug = require('debug')('snapchat:stories')

var constants = require('./constants')

/**
 * Snapchat wrapper for story-related API calls.
 *
 * @param {Object} opts
 */
function Stories (client, opts) {
  var self = this
  if (!(self instanceof Stories)) return new Stories(client, opts)
  if (!opts) opts = {}

  self.client = client
}

/**
 * Posts a story with the given options.
 *
 * @param {Blob} blob The Blob object containing the image or video data to send.
 * @param {Object} opts The options for the story to post.
 * @param {function} cb
 */
Stories.prototype.postStory = function (blob, opts, cb) {
}

/**
 * Downloads media for a story.
 *
 * @param story The story to download.
 * @param {function} cb
 */
Stories.prototype.loadStoryBlob = function (story, cb) {
}

/**
 * Downloads the thumbnail for a story.
 *
 * @param story The story whose thumbnail you wish to download.
 * @param {function} cb
 */
Stories.prototype.loadStoryThumbnailBlob = function (story, cb) {
}

/**
 * Batch loads media for a set of stories.
 *
 * @param stories An array of \c Story objects whose media you wish to download.
 * @param {function} cb
 */
Stories.prototype.loadStories = function (stories, cb) {
}

/**
 * Deletes a story of yours.
 *
 * @param {function} cb
 */
Stories.prototype.deleteStory = function (story, cb) {
}

/**
 * Marks a set of stories as opened.
 *
 * @param {array} stories An array of \c StoryUpdater objects.
 * @param {function} cb
 */
Stories.prototype.markStoriesViewed = function (stories, cb) {
}

/**
 * Marks a single story opened.
 *
 * @discussion To batch mark stories viewed, use \c -markStoriesViewed:completion:.
 * @param story The story to mark as opened.
 * @param sscount The number of times the story was screenshotted.
 * @param {function} cb
 */
Stories.prototype.markStoryViewed = function (story, sscount, cb) {
}

/**
 * Hides a shared story from the story feed.
 *
 * @param {function} cb
 */
Stories.prototype.hideSharedStory = function (story, cb) {
}

/**
 * I forget what this is for. Does nothing if the story is not a shared story.
 *
 * @param sharedStory A shared story.
 * @param {function} cb
 */
Stories.prototype.provideSharedDescription = function (sharedStory, cb) {
}

/**
 * Retrieves the description for a shared story.
 *
 * @param sharedStory A shared story.
 * @param {function} cb
 */
Stories.prototype.getSharedDescriptionForStory = function (sharedStory, cb) {
}
