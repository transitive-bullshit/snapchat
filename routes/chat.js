module.exports = Chat

var debug = require('debug')('snapchat:chat')

var StringUtils = require('../lib/string-utils')

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
 * @param recipients An array of username strings.
 */
Chat.prototype.sendTypingToUsers = function (recipients) {
}

/**
 * Sends the typing notification to a single user.
 */
Chat.prototype.sendTypingToUser = function (username) {
}

/**
 * Not working, but is supposed to mark all chat messages in a conversation as read.
 *
 * @param {function} cb
 */
Chat.prototype.markRead = function (conversation, cb) {
}

/**
 * Retrieves the conversation auth mac and payload for a conversation with \c user.
 *
 * @param {function} cb
 */
Chat.prototype.conversationAuth = function (username, cb) {
}

/**
 * Retrieves the conversation with \e username.
 *
 * @param {function} cb
 */
Chat.prototype.conversationWithUser = function (username, cb) {
}

/**
 * Fetches the conversations for all users in \e usernames
 *
 * @param {function} cb
 */
Chat.prototype.conversationsWithUsers = function (usernames, cb) {
}

/**
 * Clears the conversation with the given identifier.
 *
 * @param identifier The identifier of the conversation to clear.
 * @param {function} cb
 */
Chat.prototype.clearConversationWithIdentifier = function (identifier, cb) {
}

/**
 * Clears the entire feed.
 *
 * @param {function} cb
 */
Chat.prototype.clearFeed = function (cb) {
}

/**
 * Sends a message \e message to \e username.
 *
 * @param message The message to send.
 * @param username The username of the recipient.
 * @param {function} cb
 */
Chat.prototype.sendMessage = function (message, username, cb) {
}

/**
 * Sends a message \e message to each user in \e recipients.
 *
 * @param message The message to send.
 * @param recipients An array of username strings.
 * @param {function} cb
 */
Chat.prototype.sendMessage = function (message, recipients, cb) {
}

/**
 * Loads another page of conversations in the feed after the given conversation.
 *
 * @discussion This method will update \c [Client sharedClient],currentSession.conversations accordingly.
 * @param conversation The conversation after which to load more conversations.
 * @param {function} cb
 */
Chat.prototype.loadConversationsAfter = function (conversation, cb) {
}

/**
 * Loads every conversation.
 *
 * @discussion This method will update \c [Client sharedClient].currentSession.conversations accordingly.
 * @param {function} cb
 * @note \e cb will still take an error if it retrieved some conversations, but failed to get the rest after some point.
 */
Chat.prototype.allConversations = function (cb) {
}

/**
 * Loads more messages after the given message or cash transaction.
 *
 * @param messageOrTransaction any object conforming to Pagination \b EXCEPT AN \C Conversation.
 * @warning Do not pass an \c Conversation object to messageOrTransaction. Doing so will raise an exception.
 * @param {function} cb
 */
Chat.prototype.loadMessagesAfterPagination = function (messageOrTransaction, cb) {
}

/**
 * Loads every message in the given thread and adds them to that Conversation object.
 *
 * @param conversation The conversation to load completely.
 * @param completion Takes an error, if any.
 */
Chat.prototype.fullConversation = function (conversation, cb) {
}
