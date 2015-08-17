module.exports = Message

var debug = require('debug')('snapchat:message')

var constants = require('../lib/constants')

/**
 * Snapchat Message
 *
 * @param {Object} params
 */
function Message (params) {
  var self = this
  if (!(self instanceof Message)) return new Message(params)

  var message = params['chat_message']
  var media = message['body']['media']
  var header = message['header']
  var type = message['body']['type']

  self.identifier = message['id']
  self.messageIdentifier = message['chat_message_id']
  self.pagination = params['iter_token']
  self.messageKind = constants.messageKindFromString(type)
  self.created = new Date(+message['timestamp'])

  if (self.messageKind === constants.MessageKind.Text) {
    self.text = message['body']['text']
  } else {
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

    if (self.messageKind === null) {
      debug('invalid MessageKind (%s)', type)
    }
  }

  self.conversationIdentifier = header['conv_id']

  self.recipients = header['to']
  self.sender = header['from']

  self.index = message['seq_num'] | 0
  self.savedState = message['saved_state']
  self.type = message['type']

  if (self.type !== 'chat_message') {
    debug('unknown chat message type (%s)', self.type)
  }
}
