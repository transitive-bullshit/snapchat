module.exports = Conversation

var debug = require('debug')('snapchat:conversation')
var Snap = require('./snap')

var Message = require('./message')
var CashTransaction = require('./cash-transaction')
var Transaction = require('./transaction')

/**
 * Snapchat Conversation
 *
 * @param {Object} params
 */
function Conversation (params) {
  var self = this
  if (!(self instanceof Conversation)) return new Conversation(params)

  var convoMessages = params['conversation_messages']
  var lastChatActions = params['last_chat_actions']
  var lastTransaction = params['last_cash_transaction']
  var pendingRecievedSnaps = params['pending_received_snaps']
  var messages = convoMessages['messages']
  var lastSnap = params['last_snap']
  var lastInteraction = +params['last_interaction_ts']

  self.messagingAuth = convoMessages['messaging_auth']

  self.state = params['conversation_state']
  self.identifier = params['id']
  self.pagination = params['iter_token']

  self.lastSnap = lastSnap ? new Snap(lastSnap) : null
  self.lastTransaction = lastTransaction ? new Transaction(lastTransaction) : null
  self.lastInteraction = lastInteraction > 0 ? new Date(lastInteraction) : null
  if (lastChatActions) {
    // self.lastChatType = SKChatTypeFromString(lastChatActions['last_write_type'])
    // self.lastChatRead = +NSDate dateWithTimeIntervalSince1970:[lastChatActions['last_read_timestamp']/1000]
    // self.lastChatWrite = +NSDate dateWithTimeIntervalSince1970:[lastChatActions['last_write_timestamp']/1000]
    self.lastChatReader = lastChatActions['last_reader']
    self.lastChatWriter = lastChatActions['last_writer']
  }

  self.participants = params['participants'] || self.identifier.split('~')
  self.usersWithPendingChats = params['pending_chats_for'] || []

  // Messages
  self.messages = messages.map(function (message) {
    if (message['snap']) {
      return new Snap(message['snap'])
    } else if (message['chat_message']) {
      return new Message(message['chat_message'])
    } else if (message['cash_transaction']) {
      return new CashTransaction(message['chat_transaction'])
    } else {
      debug('Unhandled conversation message type:%s', message)
      return null
    }
  })

  // Pending recieved snaps
  self.pendingRecievedSnaps = pendingRecievedSnaps.map(function (snap) {
    return new Snap(snap)
  })
}

Conversation.prototype.addMessagesFromConversation = function (convo) {
  var self = this
  if (!convo.messages.count) return

  self.messages = self.messages.concat(convo.messages)
}
