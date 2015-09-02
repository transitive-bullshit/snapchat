module.exports = Story

var Promise = require('bluebird')

var BufferUtils = require('../lib/buffer-utils')
var Snapchat = require('../')

/**
 * Snapchat Story
 *
 * @class
 * @param {Snapchat} client
 * @param {Object} params
 */
function Story (client, params) {
  var self = this
  if (!(self instanceof Story)) return new Story(client, params)
  if (!(client instanceof Snapchat)) throw new Error('invalid client')

  self.client = client

  // null until you call load
  // self.blob = null

  // null until you call loadThumbnail
  // self.thumbnailBlob = null

  self.author = params['username']
  self.viewed = !!params['viewed']
  self.shared = !!params['is_shared']
  self.zipped = !!params['zipped']
  self.matureContent = !!params['mature_content']
  self.needsAuth = !!params['needs_auth']

  self.duration = params['time'] || 0

  self.identifier = params['id']
  self.text = params['caption_text_display']
  self.clientIdentifier = params['client_id']

  if (params['story_filter_id'].length) {
    self.storyFilterIdentifier = params['story_filter_id']
  }
  self.adCanFollow = !!params['ad_can_follow']

  self.mediaIdentifier = params['media_id']
  self.mediaIV = params['media_iv']
  self.mediaKey = params['media_key']
  self.mediaKind = params['media_type'] || 0
  self.mediaURL = params['media_url']

  self.thumbIV = params['thumbnail_iv']
  self.thumbURL = params['thumbnail_url']

  self.timeLeft = params['time_left'] || 0
  self.created = new Date(+params['timestamp']).toISOString()
}

/**
 * The underlying data for the image or video.
 *
 * @name Story#suggestedFilename
 * @property {string}
 */
Object.defineProperty(Story.prototype, 'suggestedFilename', {
  get: function () {
    var self = this

    if (!self.blob) {
      return null
    } else if (self.blob.isImage || self.blob.isVideo) {
      return self.identifier + BufferUtils.getFileExtension(self.blob.data)
    } else {
      return self.identifier
    }
  }
})

/**
 * Loads the blob for the story. If successful, the blob property of the original Story object will contain the story's blob data.
 */
Story.prototype.load = function (cb) {
  var self = this
  return new Promise(function (resolve, reject) {

    self.client.stories.loadStoryBlob(self, function (err, blob) {
      if (err) {
        return reject(err)
      }

      // seperate media & overlay data
      if (Array.isArray(blob)) {
        if (blob.length > 2) {
        }
        self.overlay = blob[1].blob
        blob = blob[0].blob
      }

      self.blob = blob
      return resolve(blob)
    })

  }).nodeify(cb)
}

/**
 * Loads the blob for the story thumbnail. If successful, the thumbnailBlob property of the original Story object will contain the story's thumbnail blob data.
 */
Story.prototype.loadThumbnail = function (cb) {
  var self = this
  return new Promise(function (resolve, reject) {
    console.log('loadThumnail: 1');
    self.client.stories.loadStoryThumbnailBlob(self, function (err, blob) {
      console.log('loadThumnail: 5');
      if (err) {
        return reject(err)
      }

      self.thumbnailBlob = blob
      return resolve(self)
    })

  }).nodeify(cb)
}
