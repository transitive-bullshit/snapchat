module.exports = Chat

var debug = require('debug')('snapchat:chat')
var async = require('async')
var extend = require('xtend')

var constants = require('../lib/constants')
var StringUtils = require('../lib/string-utils')

var Conversation = require('../models/conversation')

/**
 * Snapchat wrapper for chat-related API calls.
 *
 * @param {Object} opts
 */
function Chat (client, opts) {
  var self = this
  if (!(self instanceof Chat)) return new Chat(client, opts)
  if (!opts) opts = {}

  self.client = client
}

/**
 * Sends the typing notification to the given users.
 *
 * @param {Array[string]} recipients An array of username strings.
 * @param {function} cb
 */
Chat.prototype.sendTypingToUsers = function (recipients, cb) {
  var self = this
  debug('Chat.sendTypingToUsers')

  self._sendTyping(JSON.stringify(recipients), cb)
}

/**
 * Sends the typing notification to a single user.
 *
 * @param {string} username
 * @param {function} cb
 */
Chat.prototype.sendTypingToUser = function (username, cb) {
  var self = this
  debug('Chat.sendTypingToUser (%s)', username)

  self._sendTyping(JSON.stringify([ username ]), cb)
}

/**
 * Marks all chat messages in a conversation as read.
 *
 * @TODO currently not working
 * @param {Conversation} conversation
 * @param {function} cb
 */
Chat.prototype.markRead = function (conversation, cb) {
  var self = this
  debug('Chat.markRead (%s)', conversation.identifier)

  self.client.sendEvents([
    {
      'eventName': 'CHAT_TEXT_VIEWED',
      'params': {
        'id': conversation.identifier
      },
      'ts': StringUtils.timestamp() | 0
    }
  ], null, cb)
}

/**
 * Retrieves the conversation auth mac and payload for a conversation with \c username.
 *
 * @param {string} username
 * @param {function} cb
 */
Chat.prototype.conversationAuth = function (username, cb) {
  var self = this
  debug('Chat.conversationAuth (%s)', username)

  var cid = StringUtils.SCIdentifier(self.client.username, username)

  self.client.post(constants.endpoints.chat.authToken, {
    'username': self.client.username,
    'conversation_id': cid
  }, function (err, response, body) {
    if (err) {
      return cb(err)
    } else {
      var result = StringUtils.tryParseJSON(body)

      if (result) {
        result = result['messaging_auth']

        if (result && result['mac'] && result['payload']) {
          return cb(null, result)
        }
      }

      cb('Chat.conversationAuth parse error')
    }
  })
}

/**
 * Retrieves the conversation with \e username.
 *
 * @param {string} username
 * @param {function} cb
 */
Chat.prototype.conversationWithUser = function (username, cb) {
  var self = this
  debug('Chat.conversationWithUser (%s)', username)

  self.conversationsWithUsers([ username ], function (err, results) {
    if (err) {
      cb(err)
    } else if (!results.conversations.length) {
      cb('Chat.conversationWithUser error')
    } else {
      cb(null, results.conversations[0])
    }
  })
}

/**
 * Fetches the conversations for all users in \e usernames
 *
 * @param {function} cb
 */
Chat.prototype.conversationsWithUsers = function (usernames, cb) {
  var self = this
  debug('Chat.conversationsWithUsers (%d)', usernames.length)

  var results = {
    conversations: [ ],
    failed: [ ],
    errors: [ ]
  }

  var messages = [ ]

  async.eachLimit(usernames, 4, function (username, cb) {
    self.conversationAuth(username, function (err, auth) {
      if (err) {
        results.failed.push(username)
        results.errors.push(err)
        cb(err)
      } else {
        var identifier = StringUtils.uniqueIdentifer()
        var header = {
          'auth': auth,
          'to': [ username ],
          'conv_id': StringUtils.SCIdentifier(self.client.username, username),
          'from': self.client.username,
          'conn_sequence_number': 0
        }

        var first = {
          'presences': { },
          'receiving_video': false,
          'supports_here': true,
          'header': header,
          'retried': false,
          'id': identifier,
          'type': 'presence'
        }

        first.presences[self.client.username] = true
        first.presences[username] = false

        var header2 = extend(header, {
          'conv_id': StringUtils.SCIdentifier(username, self.client.username)
        })

        var second = {
          'presences': { },
          'receiving_video': false,
          'supports_here': true,
          'header': header2,
          'retried': false,
          'id': identifier,
          'type': 'presence'
        }

        second.presences[self.client.username] = true
        second.presences[username] = false

        messages.push(first)
        messages.push(second)
        cb(null)
      }
    })
  }, function () {
    self.client.post(constants.endpoints.chat.sendMessage, {
      'auth_token': self.client.authToken,
      'messages': JSON.stringify(messages),
      'username': self.client.username
    }, function (err, response, body) {
      if (err) {
        return cb(err)
      } else {
        var result = StringUtils.tryParseJSON(body)

        if (result && result.conversations && result.conversations.length) {
          results.conversations = result.conversations.map(function (convo) {
            return new Conversation(convo)
          })

          cb(null, results)
        } else {
          debug('Chat.conversationsWithUsers parse error %s', body)
        }
      }

      cb('Chat.conversationsWithUsers parse error')
    })
  })
}

/**
 * Clears the conversation with the given identifier.
 *
 * @param identifier The identifier of the conversation to clear.
 * @param {function} cb
 */
Chat.prototype.clearConversationWithIdentifier = function (identifier, cb) {
  var self = this
  debug('Chat.clearConversationWithIdentifier (%s)', identifier)
}

/**
 * Clears the entire feed.
 *
 * @param {function} cb
 */
Chat.prototype.clearFeed = function (cb) {
  var self = this
  debug('Chat.clearFeed')
}

/**
 * Sends a message \e message to \e username.
 *
 * @param message The message to send.
 * @param username The username of the recipient.
 * @param {function} cb
 */
Chat.prototype.sendMessage = function (message, username, cb) {
  var self = this
  debug('Chat.sendMessage (%s, %s)', message, username)
}

/**
 * Sends a message \e message to each user in \e recipients.
 *
 * @param message The message to send.
 * @param recipients An array of username strings.
 * @param {function} cb
 */
Chat.prototype.sendMessages = function (message, recipients, cb) {
  var self = this
  debug('Chat.sendMessage (%s, %s)', message, JSON.stringify(recipients))
}

/**
 * Loads another page of conversations in the feed after the given conversation.
 *
 * @discussion This method will update \c [Client sharedClient],currentSession.conversations accordingly.
 * @param conversation The conversation after which to load more conversations.
 * @param {function} cb
 */
Chat.prototype.loadConversationsAfter = function (conversation, cb) {
  var self = this
  debug('Chat.loadConversationAfter')
}

/**
 * Loads every conversation.
 *
 * @discussion This method will update \c [Client sharedClient].currentSession.conversations accordingly.
 * @param {function} cb
 * @note \e cb will still take an error if it retrieved some conversations, but failed to get the rest after some point.
 */
Chat.prototype.allConversations = function (cb) {
  var self = this
  debug('Chat.allConversations')
}

/**
 * Loads more messages after the given message or cash transaction.
 *
 * @param messageOrTransaction any object conforming to Pagination \b EXCEPT AN \C Conversation.
 * @warning Do not pass an \c Conversation object to messageOrTransaction. Doing so will raise an exception.
 * @param {function} cb
 */
Chat.prototype.loadMessagesAfterPagination = function (messageOrTransaction, cb) {
  var self = this
  debug('Chat.loadMessagesAfterPagination')
}

/**
 * Loads every message in the given thread and adds them to that Conversation object.
 *
 * @param conversation The conversation to load completely.
 * @param {function} cb
 */
Chat.prototype.fullConversation = function (conversation, cb) {
  var self = this
  debug('Chat.fullConversation')
}

/**
 * @internal
 */
Chat.prototype._sendTyping = function (recipientString, cb) {
  var self = this

  self.client.post(constants.endpoints.chat.typing, {
    'recipient_usernames': recipientString,
    'username': self.client.username
  }, cb)
}
