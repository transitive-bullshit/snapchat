module.exports = Message

var debug = require('debug')('snapchat:message')

var constants = require('../lib/constants')

/**
 * Snapchat Message
 *
 * @class
 * @param {Object} params
 */
function Message (params) {
  var self = this
  if (!(self instanceof Message)) return new Message(params)

  var message = params['chat_message'] || params
  var header = message['header']
  var body = message['body'] || { }
  var media = body['media']
  var type = body['type']

  self.identifier = message['id']
  self.messageIdentifier = message['chat_message_id']
  self.pagination = params['iter_token']
  self.messageKind = constants.messageKindFromString(type)
  self.created = new Date(+message['timestamp'])

  if (!self.messageKind) {
    debug('invalid MessageKind (%s %j)', type, params)
  } else if (self.messageKind === constants.MessageKind.Text.value) {
    self.text = body['text']
  } else if (media) {
    self.mediaIdentifier = media['media_id']
    self.mediaSize = {
      'width': media['width'] | 0,
      'height': media['height'] | 0
    }
    self.mediaIV = media['iv']
    self.mediaKey = media['key']
    self.mediaType = media['media_type']

    if (self.mediaType) {
      self.mediaType = 'UNSPECIFIED'
    } else if (self.mediaType !== 'VIDEO') {
      debug('new message type (%s)', self.mediaType)
    }
  }

  self.conversationIdentifier = header['conv_id']

  self.recipients = header['to']
  self.sender = header['from']

  self.index = message['seq_num'] | 0
  self.savedState = message['saved_state']
  self.type = message['type']

  if (self.type !== 'chat_message') {
    debug('unknown chat message type (%s %j)', self.type, params)
  }
}
