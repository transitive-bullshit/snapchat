#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')

var Snapchat = require('../')
var Conversation = require('../models/conversation')

var client = new Snapchat()
var TEST_USERNAME = 'teamsnapchat'

client.signIn(function (err) {
  if (err) throw new Error('signIn error', err)

  test('Snapchat.chat.sendTypingToUsers', function (t) {
    client.chat.sendTypingToUsers([ TEST_USERNAME ], function (err) {
      t.notOk(err)
      t.end()
    })
  })

  test('Snapchat.chat.sendTypingToUser', function (t) {
    client.chat.sendTypingToUser(TEST_USERNAME, function (err) {
      t.notOk(err)
      t.end()
    })
  })

  test('Snapchat.chat.conversationAuth', function (t) {
    client.chat.conversationAuth(TEST_USERNAME, function (err, result) {
      t.notOk(err)
      t.ok(result)
      t.ok(result.mac)
      t.ok(result.payload)
      t.end()
    })
  })

  test('Snapchat.chat.conversationWithUser', function (t) {
    client.chat.conversationWithUser(TEST_USERNAME, function (err, result) {
      t.notOk(err)
      t.notOk(result) // should be an empty conversation
      t.end()
    })
  })

  test('Snapchat.chat.clearFeed', function (t) {
    client.chat.clearFeed(function (err) {
      t.notOk(err)
      t.end()
    })
  })

  /*test('Snapchat.chat.sendMessage', function (t) {
    client.chat.sendMessage('holla', TEST_USERNAME, function (err, result) {
      t.notOk(err)
      t.ok(result)
      t.ok(result instanceof Conversation)
      t.ok(result.identifier)
      t.end()
    })
  })*/

  test('Snapchat.chat.loadAllConversations', function (t) {
    client.chat.loadAllConversations(function (err) {
      t.notOk(err)
      t.end()
    })
  })

  // TODO:
  // Snapchat.chat.markRead
  // Snapchat.chat.conversationsWithUsers
  // Snapchat.chat.clearConversationWithIdentifier
  // Snapchat.chat.sendMessages
  // Snapchat.chat.loadConversationsAfter
  // Snapchat.chat.loadMessagesAfterPagination
  // Snapchat.chat.loadFullConversation
})
