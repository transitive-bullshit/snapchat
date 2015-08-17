module.exports = Stories

var debug = require('debug')('snapchat:stories')
var async = require('async')

var constants = require('../lib/constants')
var Request = require('../lib/request')
var StringUtils = require('../lib/string-utils')

var SKBlob = require('../models/blob')
var StoryUpdater = require('../models/story-updater')
var SharedStoryDescription = require('../models/shared-story-description')

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
  debug('Stories.postStory')

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
 * @param {Story} story The story to download.
 * @param {function} cb SKBlob
 */
Stories.prototype.loadStoryBlob = function (story, cb) {
  var self = this
  debug('Stories.loadStoryBlob (%s)', story.identifier)

  function blobHandler (err, response, body) {
    if (err) {
      debug('Snapchat.Stories.loadStoryBlob error %s', err)
      return cb(err)
    } else {
      SKBlob.initWithStoryData(body, story, cb)
    }
  }

  if (story.needsAuth) {
    Request.post(constants.endpoints.stories.authBlob, {
      'story_id': story.mediaIdentifier,
      'username':  self.client.username
    }, self.client.googleAuthToken, self.client.authToken, blobHandler)
  } else {
    self.client.get(story.mediaURL.replace(constants.endpoints.baseURL), blobHandler)
  }
}

/**
 * Downloads the thumbnail for a story.
 *
 * @param story The story whose thumbnail you wish to download.
 * @param {function} cb SKBlob
 */
Stories.prototype.loadStoryThumbnailBlob = function (story, cb) {
  var self = this
  debug('Stories.loadStoryThumbnailBlob (%s)', story.identifier)

  self.client.get(constants.endpoints.stories.thumb + story.mediaIdentifier, function (err, response, body) {
    if (err) {
      debug('Snapchat.Stories.loadStoryThumbnailBlob error %s', err)
      return cb(err)
    }

    SKBlob.initWithStoryData(body, story, cb)
  })
}

/**
 * Batch loads media for a set of stories.
 *
 * @param {Array[Story]} stories An array of \c Story objects whose media you wish to download.
 * @param {function} cb
 */
Stories.prototype.loadStories = function (stories, cb) {
  debug('Stories.loadStories (%d)', stories.length)

  var results = {
    loaded: [ ],
    failed: [ ],
    errors: [ ]
  }

  async.eachLimit(stories, 4, function (story, cb) {
    story.load(function (err) {
      if (err) {
        results.failed.push(story)
        results.errors.push(err)
      } else {
        results.loaded.push(story)
      }

      cb(err)
    })
  }, function (err) {
    cb(err, results)
  })
}

/**
 * Deletes a story of yours.
 *
 * @param {UserStory} story
 * @param {function} cb
 */
Stories.prototype.deleteStory = function (story, cb) {
  var self = this
  debug('Stories.deleteStory (%s)', story.identifier)

  self.client.post(constants.endpoints.stories.remove, {
    'story_id': story.identifier,
    'username': self.client.username
  }, function (err) {
    if (!err) {
      var index = self.client.currentSession.userStories.indexOf(story)
      if (index >= 0) {
        self.client.currentSession.userStories.splice(index, 1)
      }
    }

    cb(err)
  })
}

/**
 * Marks a set of stories as opened.
 *
 * @param {Array[StoryUpdater]} stories An array of \c StoryUpdater objects.
 * @param {function} cb
 */
Stories.prototype.markStoriesViewed = function (stories, cb) {
  var self = this
  debug('Stories.markStoriesViewed (%d)', stories.length)

  var friendStories = stories.map(function (update) {
    return {
      "id": update.storyID,
      "screenshot_count": update.screenshotCount,
      "timestamp": update.timestamp
    }
  })

  self.client.post(constants.endpoints.update.stories, {
    "username": self.client.username,
    "friend_stories": friendStories
  }, cb)
}

/**
 * Marks a single story opened.
 * To batch mark stories viewed, use \c markStoriesViewed
 *
 * @param {Story} story The story to mark as opened.
 * @param {number} sscount The number of times the story was screenshotted.
 * @param {function} cb
 */
Stories.prototype.markStoryViewed = function (story, sscount, cb) {
  var self = this
  debug('Stories.markStoryViewed (%s)', story.identifier)

  self.markStoriesViewed([
    new StoryUpdater(story.identifier, StringUtils.timestamp(), sscount)
  ], cb)
}

/**
 * Hides a shared story from the story feed.
 *
 * @param {function} cb
 */
Stories.prototype.hideSharedStory = function (story, cb) {
  var self = this
  debug('Stories.hideSharedStory (%s)', story.identifier)

  self.client.post(constants.endpoints.friends.hide, {
    'friend': story.username,
    'hide': 'true',
    'username': self.client.username
  }, cb)
}

/**
 * Does nothing if the story is not a shared story.
 *
 * @param {Story} sharedStory A shared story.
 * @param {function} cb
 */
Stories.prototype.provideSharedDescription = function (sharedStory, cb) {
  var self = this
  debug('Stories.provideSharedDescription (%s)', sharedStory.identifier)
  if (!sharedStory.shared) return

  self.client.post(constants.endpoints.sharedDescription, {
    'shared_id': sharedStory.identifier,
    'username': self.client.username
  }, cb)
}

/**
 * Retrieves the description for a shared story.
 *
 * @param sharedStory A shared story.
 * @param {function} cb
 */
Stories.prototype.getSharedDescriptionForStory = function (sharedStory, cb) {
  var self = this
  debug('Stories.getSharedDescriptionForStory (%s)', sharedStory.identifier)

  if (!sharedStory.sharedStoryIdentifier) {
    throw new Error('Snapchat.Stories.getSharedDescriptionForStory error invalid story')
  }

  var endpoint = constants.endpoints.sharedDescription + '?ln=en&shared_id=' + sharedStory.sharedStoryIdentifier

  self.client.get(endpoint, function (err, response, body) {
    if (err) {
      return cb(err)
    } else {
      var result = StringUtils.tryParseJSON(body)

      if (result) {
        return cb(null, new SharedStoryDescription(result))
      }
    }

    cb('Snapchat.Stories.getSharedDescriptionForStory parse error')
  })
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
