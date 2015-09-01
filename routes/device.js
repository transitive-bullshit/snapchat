module.exports = Device

var debug = require('debug')('snapchat:device')
var Promise = require('bluebird')

var constants = require('../lib/constants')
var StringUtils = require('../lib/string-utils')

/**
 * Snapchat wrapper for chat-related API calls.
 *
 * @class
 * @param {Object} opts
 */
function Device (client, opts) {
  var self = this
  if (!(self instanceof Device)) return new Device(client, opts)
  if (!opts) opts = {}

  self.client = client
}

/**
 * Sends the "app did open" event to Snapchat.
 *
 * @param {function} cb
 */
Device.prototype.sendDidOpenAppEvent = function (cb) {
  var self = this
  return new Promise(function (resolve, reject){

    debug('Device.sendDidOpenAppEvent')

    self.client.updateSession(function (err) {
      if (err) {
        return reject(err)
      }

      var uuid = StringUtils.uniqueIdentifer()
      var friendCount = -1

      self.client.session.friends.forEach(function (friend) {
        if (friend.privacy === constants.SnapPrivacy.Friends) {
          ++friendCount
        }
      })

      var unimplemented = 'Unimplemented'
      var timestamp = StringUtils.timestamp()

      self.client.sendEvents({
        'common_params': {
          'user_id': StringUtils.md5HashToHex(self.client.username),
          'city': unimplemented,
          'sc_user_agent': constants.core.userAgent,
          'session_id': '00000000-0000-0000-0000-000000000000',
          'region': unimplemented,
          'latlon': unimplemented,
          'friend_count': friendCount,
          'country': unimplemented
        },
        'events': [
          {
            'event_name': 'APP_OPEN',
            'event_timestamp': timestamp,
            'event_params': {
              'open_state': 'NORMAL',
              'intent_action': 'NULL'
            }
          }
        ],
        'batch_id': uuid + '-' + constants.core.userAgent.replace(/\w+/, '') + timestamp
      }, null, function (err, result) {
        if (err) {
          return reject(err)
        }
        return reject(result)
      })
    })

  }).nodeify(cb)
}

/**
 * Sends the "app did close" event to Snapchat.
 *
 * @param {function} cb
 */
Device.prototype.sendDidCloseAppEvent = function (cb) {
  var self = this
  debug('Device.sendDidCloseAppEvent')

  return self.client.sendEvents([
    {
      'eventName': 'CLOSE',
      'params': { },
      'ts': StringUtils.timestamp()
    }
  ], null, cb)
}
