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
 * @class
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
 * @param {Array<string>} recipients An array of username strings.
 * @param {function} cb
 */
Chat.prototype.sendTypingToUsers = function (recipients, cb) {
  var self = this
  debug('Chat.sendTypingToUsers')

  self._sendTyping(recipients, cb)
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

  self._sendTyping([ username ], cb)
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
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result) {
      result = result['messaging_auth']

      if (result && result['mac'] && result['payload']) {
        return cb(null, result)
      }

      return cb('Chat.conversationAuth parse error')
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
      return cb(err)
    } else {
      return cb(null, results.conversations[0])
    }
  })
}

/**
 * Fetches the conversations for all users in \e usernames
 *
 * @param {Array<string>} usernames
 * @param {function} cb
 */
Chat.prototype.conversationsWithUsers = function (usernames, cb) {
  var self = this
  debug('Chat.conversationsWithUsers (%j)', usernames)

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
        return cb(err)
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
        return cb(null)
      }
    })
  }, function () {
    self.client.post(constants.endpoints.chat.sendMessage, {
      'auth_token': self.client.authToken,
      'messages': messages,
      'username': self.client.username
    }, function (err, result) {
      if (err) {
        return cb(err)
      } else if (result) {
        if (result.conversations) {
          results.conversations = result.conversations.map(function (convo) {
            return new Conversation(convo)
          })

          return cb(null, results)
        } else {
          debug('Chat.conversationsWithUsers parse error %j', result)
        }
      }

      return cb('Chat.conversationsWithUsers parse error')
    })
  })
}

/**
 * Clears the conversation with the given identifier.
 *
 * @param {string} identifier The identifier of the conversation to clear.
 * @param {function} cb
 */
Chat.prototype.clearConversationWithIdentifier = function (identifier, cb) {
  var self = this
  debug('Chat.clearConversationWithIdentifier (%s)', identifier)

  self.client.post(constants.endpoints.chat.clearConvo, {
    'conversation_id': identifier,
    'username': self.client.username
  }, cb)
}

/**
 * Clears the entire feed.
 *
 * @param {function} cb
 */
Chat.prototype.clearFeed = function (cb) {
  var self = this
  debug('Chat.clearFeed')

  self.client.post(constants.endpoints.chat.clearFeed, {
    'username': self.client.username
  }, cb)
}

/**
 * Sends a message \e message to \e username.
 *
 * @param {string} message The message to send.
 * @param {Array<string>} username The username of the recipient.
 * @param {function} cb
 */
Chat.prototype.sendMessage = function (message, username, cb) {
  var self = this
  debug('Chat.sendMessage ("%s", %s)', message, username)

  self.sendMessageToUsers(message, [ username ], function (err, results) {
    if (err) {
      return cb(err)
    } else if (!results.conversations.length) {
      return cb('Chat.conversationWithUser error')
    } else {
      return cb(null, results.conversations[0])
    }
  })
}

/**
 * Sends a message \e message to each user in \e usernames.
 *
 * @TODO: what to do if message fails to send
 *
 * @param {string} message The message to send.
 * @param {Array<string>} usernames An array of username strings as recipients.
 * @param {function} cb
 */
Chat.prototype.sendMessageToUsers = function (message, usernames, cb) {
  var self = this
  debug('Chat.sendMessageToUsers ("%s", %j)', message, usernames)

  var results = {
    conversations: [ ],
    failed: [ ],
    errors: [ ]
  }

  self.conversationsWithUsers(usernames, function (err, convoResults) {
    if (err) {
      return cb(err)
    }

    results.failed = convoResults.failed
    results.errors = convoResults.errors

    console.log('failed', results.failed)
    console.log('errors', results.errors)
    console.log('results', convoResults.conversations)

    var messages = convoResults.conversations.map(function (convo) {
      var identifier = StringUtils.uniqueIdentifer()
      var sequenceNum = ((convo.state['conversation_state']['user_sequences'][self.client.username]) || 0) | 0

      var header = {
        'auth': convo.messagingAuth,
        'to': [ convo.recipient ],
        'from': self.client.username,
        // 'conn_sequence_number': 1,
        'conn_sequ_num': 1,
        'conv_id': convo.identifier
      }

      return {
        'body': { 'type': 'text', 'text': message },
        'chat_message_id': identifier,
        'seq_num': sequenceNum + 1,
        'timestamp': StringUtils.timestamp(),
        'retried': false,
        'id': identifier,
        'type': 'chat_message',
        'header': header
      }
    })

    if (!messages.length) {
      debug('Chat.sendMessageToUsers error retrieving conversations')
      return cb('Chat.sendMessageToUsers error retrieving conversations')
    } else {
      self.client.post(constants.endpoints.chat.sendMessage, {
        'auth_token': self.client.authToken,
        'messages': messages,
        'username': self.client.username
      }, function (err, result) {
        if (err) {
          return cb(err)
        } else if (result) {
          if (result.conversations && result.conversations.length) {
            results.conversations = result.conversations.map(function (convo) {
              return new Conversation(convo)
            })

            return cb(null, results)
          } else {
            debug('Chat.sendMessageToUsers parse error %j', result)
          }
        }

        return cb('Chat.sendMessageToUsers parse error')
      })
    }
  })
}

/**
 * Loads another page of conversations in the feed after the given conversation.
 *
 * This method will update \c client.currentSession.conversations accordingly.
 *
 * @param {Conversation} conversation The conversation after which to load more conversations.
 * @param {function} cb
 */
Chat.prototype.loadConversationsAfter = function (conversation, cb) {
  var self = this
  debug('Chat.loadConversationsAfter')

  if (!conversation.pagination.length) {
    return cb(null, [ ])
  }

  self.client.post(constants.endpoints.chat.conversations, {
    'username': self.client.username,
    'checksum': StringUtils.md5HashToHex(self.client.username),
    'offset': conversation.pagination
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result) {
      result = result['conversations_response']

      if (result) {
        var conversations = result.map(function (result) {
          var convo = new Conversation(result)

          self.client.currentSession.conversations.push(convo)
          return convo
        })

        return cb(null, conversations)
      }

      return cb('Chat.loadConversationsAfter parse error')
    }
  })
}

/**
 * Loads all conversations into the current session.
 *
 * This method will update \c client.currentSession.conversations accordingly.
 * @param {function} cb
 */
Chat.prototype.loadAllConversations = function (cb) {
  var self = this
  debug('Chat.loadAllConversations')

  self.client.updateSession(function (err) {
    if (err) {
      return cb(err)
    }

    var conversations = [ ]
    var last = self.client.currentSession.conversations[self.client.currentSession.conversations.length - 1]

    function loadPage () {
      self.loadConversationsAfter(last, function (err, convos) {
        if (err) {
          return cb(err, conversations)
        } else if (convos.length > 0) {
          conversations = conversations.concat(convos)
          last = convos[convos.length - 1]
          loadPage()
        } else {
          conversations.forEach(function (convo) {
            self.client.currentSession.conversations.push(convo)
          })

          return cb(null, conversations)
        }
      })
    }

    loadPage()
  })
}

/**
 * Loads more messages after the given message or cash transaction.
 *
 * @param {Transaction|Message} messageOrTransaction any object conforming to Pagination \b EXCEPT AN \C Conversation.
 * @warning Do not pass an \c Conversation object to messageOrTransaction. Doing so will throw an exception.
 * @param {function} cb
 */
Chat.prototype.loadMessagesAfterPagination = function (messageOrTransaction, cb) {
  var self = this
  debug('Chat.loadMessagesAfterPagination')

  if (messageOrTransaction instanceof Conversation ||
     !messageOrTransaction.conversationIdentifier) {
    throw new Error('Chat.loadMessagesAfterPagination invalid param')
  }

  if (!messageOrTransaction.pagination.length) {
    return cb(null, null)
  }

  self.clients.post(constants.endpoints.chat.conversation, {
    'username': self.client.username,
    'conversation_id': messageOrTransaction.conversationIdentifier,
    'offset': messageOrTransaction.pagination
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result && result.conversation) {
      return cb(null, new Conversation(result.conversation))
    }

    return cb('Chat.loadConversationsAfter parse error')
  })
}

/**
 * Loads all messages in the given thread and adds them to that Conversation object.
 *
 * @param {Conversation} conversation The conversation to load completely.
 * @param {function} cb
 */
Chat.prototype.loadFullConversation = function (conversation, cb) {
  var self = this
  debug('Chat.loadFullConversation')

  var last = conversation.messages[conversation.messages.length - 1]

  function loadPage () {
    self.loadMessagesAfterPagination(last, function (err, convo) {
      if (err) {
        return cb(err)
      } else if (convo) {
        last = convo.messages[convo.messages.length - 1]
        conversation.addMessagesFromConversation(convo)
        loadPage()
      } else {
        return cb(null)
      }
    })
  }

  loadPage()
}

/**
 * @private
 */
Chat.prototype._sendTyping = function (recipients, cb) {
  var self = this

  self.client.post(constants.endpoints.chat.typing, {
    'recipient_usernames': JSON.stringify(recipients),
    'username': self.client.username
  }, cb)
}
