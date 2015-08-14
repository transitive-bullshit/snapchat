module.exports = Stories

var debug = require('debug')('snapchat: stories')

var constants = require('../lib/constants')
var Request = require('../lib/request')
var StringUtils = require('../lib/string-utils')

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
 * @param {StoryOptions} opts The options for the story to post.
 * @param {function} cb
 */
Stories.prototype.postStory = function (blob, opts, cb) {
  var self = this

  self._uploadStory(blob, function (err, mediaID) {
    if (err) {
      debug('Snapchat.Stories.postStory error %s', err)
      return cb(err)
    }

    self.client.post(constants.endpoints.stories.post, {
      "caption_text_display": opts.text,
      "story_timestamp": StringUtils.timestamp(),
      'type': blob.isImage ? constants.MediaKind.Image : constants.MediaKind.Video,
      "media_id": mediaID,
      "client_id": mediaID,
      "time": opts.timer | 0,
      "username": self.client.username,
      "camera_front_facing": opts.cameraFrontFacing,
      "my_story": 'true',
      "zipped": 0,
      "shared_ids": "{}"
    }, function (err, response, body) {
      if (err) {
        debug('Snapchat.Stories.postStory error %s', err)
        return cb(err)
      }

      var result = StringUtils.tryParseJSON(body)
      if (result) {
        cb(null, result)
      } else {
        debug('Snapchat.Stories.postStory parse error %s', body)
        cb('Snapchat.Stories.postStory error')
      }
    })
  })
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
 * @discussion To batch mark stories viewed, use \c -markStoriesViewed: completion: .
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

/**
 * Uploads a new story associated with the given blob.
 *
 * @internal
 * @param {SKBlob} blob
 * @param {function} cb
 */
Stories.prototype._uploadStory = function (blob, cb) {
  var self = this
  var uuid = StringUtils.mediaIdentifer(self.client.username)

  var params = {
    'media_id': uuid,
    'type': blob.isImage ? constants.MediaKind.Image : constants.MediaKind.Video,
    'data': blob.data,
    'zipped': 0,
    'features_map': '{}',
    'username': self.client.username
  }

  var headers = { }

  headers[constants.headers.clientAuthToken] = 'Bearer ' + self.client.googleAuthToken
  headers[constants.headers.contentType] = 'multipart/form-data; boundary=' + constants.core.boundary

  return Request.postCustom(constants.endpoints.stories.upload, params, headers, self.client.authToken, cb)
}
