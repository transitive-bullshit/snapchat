module.exports = Snaps

var debug = require('debug')('snapchat:snaps')

var constants = require('../lib/constants')
var StringUtils = require('../lib/string-utils')
var Request = require('../lib/request')

var SnapOptions = require('../models/snap-options')
var SKBlob = require('../models/blob')
var SKLocation = require('../models/location')

/**
 * Snapchat wrapper for friends-related API calls.
 *
 * @param {Object} opts
 */
function Snaps (client, opts) {
  var self = this
  if (!(self instanceof Snaps)) return new Snaps(client, opts)
  if (!opts) opts = {}

  self.client = client
}

/**
 * Sends a snap to everyone in \c recipients with text \c text for \c duration seconds.
 *
 * @param {SKBlob} blob The \c SKBlob object containing the image or video data to send. Can be created with any \c NSData object.
 * @param {Array[string]} recipients An array of username strings.
 * @param {string} text The text to label the snap with. This text is not superimposed upon the image; you must do that yourself.
 * @param {number} duration The length of the snap. It must be greater than \c 0 or an exception will be raised.
 * @param {function} cb
 */
Snaps.prototype.sendSnap = function (blob, recipients, text, duration, cb) {
  var self = this
  debug('Snaps.sendSnapSimple')

  self.sendSnapCustom(blob, new SnapOptions(recipients, text, duration), cb)
}

/**
 * Sends a snap with the given options.
 *
 * @param {SKBlob} blob The \c SKBlob object containing the image or video data to send. Can be created with any \c Buffer.
 * @param {SnapOptions} opts The options for the snap to be sent.
 * @param {function} cb
 */
Snaps.prototype.sendSnapCustom = function (blob, opts, cb) {
  var self = this
  debug('Snaps.sendSnap')

  self._uploadSnap(blob, function (err, mediaID) {
    if (err) {
      return cb(err)
    }

    self.client.post(constants.endpoints.snaps.send, {
      'camera_front_facing': !!opts.cameraFrontFacing,
      'country_code': self.client.currentSession.countryCode,
      'media_id': mediaID,
      'recipients': opts.recipients,
      'recipient_ids': opts.recipients,
      'reply': !!opts.isReply,
      'time': +opts.timer,
      'zipped': 0,
      'username': self.client.username
    }, cb)
  })
}

/**
 * Marks a snap as opened for \c secondsViewed seconds.
 *
 * @param {number} secondsViewed The number of seconds the snap was viewed for.
 * @param {function} cb
 */
Snaps.prototype.markSnapViewed = function (snap, secondsViewed, cb) {
  var self = this
  debug('Snaps.markSnapViewed')

  self.markSnapsViewed([ snap ], [ new Date() ], [ secondsViewed ], cb)
}

/**
 * Marks a set of snaps as opened for the specified length at the given times.
 *
 * @param {Array[SKSnap]} snaps An array of \c SKSnap objects.
 * @param {Array[Date]} times An array of \c Date objects.
 * @param {Array[number]} secondsViewed An array of \c numbers.
 * @param {function} cb
 */
Snaps.prototype.markSnapsViewed = function (snaps, times, secondsViewed, cb) {
  var self = this
  debug('Snaps.markSnapsViewed')

  if (snaps.length !== times.length || times.length !== secondsViewed.length) {
    throw new Error('Snaps.markSnapsViewed all arrays must have the same length')
  }

  var json = { }

  snaps.forEach(function (snap, index) {
    json[snap.identifier] = {
      't': StringUtils.timestampFrom(times[index]),
      'sv': secondsViewed[index]
    }
  })

  self.client.post(constants.endpoints.update.snaps, {
    'added_friends_timestamp': StringUtils.timestampFrom(self.currentSession.addedFriendsTimestamp),
    'username': self.client.username,
    'json': json
  }, cb)
}

/**
 * Marks a snap as screenshotted and viewed for \c secondsViewed seconds.
 *
 * @param {number} secondsViewed The number of seconds the snap was viewed for.
 * @param {function} cb
 */
Snaps.prototype.markSnapScreenshot = function (snap, secondsViewed, cb) {
  var self = this
  debug('Snaps.markSnapScreenshot')

  var timestamp = StringUtils.timestamp()
  var snapInfo = { }

  snapInfo[snap.identifier] = {
    't': timestamp | 0,
    'sv': secondsViewed,
    'c': constants.SnapStatus.Screenshot
  }

  var screenshot = {
    'eventName': 'SNAP_SCREENSHOT',
    'params': {
      'id': snap.identifier
    },
    'ts': StringUtils.timestamp() | 0
  }

  self.client.sendEvents([ screenshot ], snapInfo, cb)
}

/**
 * Loads a snap.
 *
 * @param {Snap} snap
 * @param {function} cb
 */
Snaps.prototype.loadSnap = function (snap, cb) {
  var self = this
  debug('Snaps.loadSnap')

  self._loadSnapWithIdentifier(snap.identifier, cb)
}

/**
 * Loads filters for a location.
 *
 * @param {Object} location { lat, lng }
 * @param {function} cb
 */
Snaps.prototype.loadFiltersForLocation = function (location, cb) {
  var self = this
  debug('Snaps.loadFiltersForLocation')

  self.client.post(constants.endpoints.misc.locationData, {
    'lat': location.lat,
    'lng': location.lng,
    'screen_width': self.client.screenSize.width,
    'screen_height': self.client.screenSize.height,
    'username': self.client.username
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result) {
      return cb(null, new SKLocation(result))
    }

    cb('Snaps.loadFiltersForLocation parse error')
  })
}

/**
 * @internal
 */
Snaps.prototype._loadSnapWithIdentifier = function (identifier, cb) {
  var self = this

  self.client.post(constants.endpoints.snaps.loadBlob, {
    'id': identifier,
    'username': self.client.username
  }, function (err, body) {
    if (err) {
      return cb(err)
    }

    SKBlob.initWithData(body, cb)
  })
}

/**
 * @internal
 */
Snaps.prototype._uploadSnap = function (blob, cb) {
  var self = this
  var uuid = StringUtils.mediaIdentifier(self.client.username)

  var params = {
    'media_id': uuid,
    'type': blob.isImage ? constants.MediaKind.Image : constants.MediaKind.Video,
    'data': blob.data,
    'zipped': 0,
    'features_map': '{ }',
    'username': self.client.username
  }

  var headers = { }
  headers[constants.headers.clientAuthToken] = 'Bearer ' + self.client.googleAuthToken
  headers[constants.headers.contentType] = 'multipart/form-data; boundary=' + constants.core.boundary

  Request.postCustom(constants.endpoints.snaps.upload, params, headers, self.client.authToken, function (err) {
    if (err) {
      return cb(err)
    } else {
      // TODO: return Snap object
      cb(null, uuid)
    }
  })
}
