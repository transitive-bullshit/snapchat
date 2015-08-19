#!/usr/bin/env node

require('dotenv').load()

var TEST_USERNAME = 'teamsnapchat'

var test = require('tape')
var Snapchat = require('../')

var client = new Snapchat()

client.signIn(function (err) {
  if (err) {
    throw new Error('signIn error', err)
  }

  /*test('Snapchat.friends.unfriend', function (t) {
    client.friends.unfriend(TEST_USERNAME, function (err) {
      t.notOk(err)

      // ensure friend does not exist in session
      client.updateSession(function (err) {
        t.notOk(err)
        t.notOk(client.session.getFriend(TEST_USERNAME))
        t.end()
      })
    })
  })

  test('Snapchat.friends.addFriend', function (t) {
    client.friends.addFriend(TEST_USERNAME, function (err) {
      t.notOk(err)
      client.updateSession(function (err) {
        t.notOk(err)
        // ensure friend exists in session
        t.ok(client.session.getFriend(TEST_USERNAME))
        t.end()
      })
    })
  })*/

  test('Snapchat.friends.findFriends', function (t) {
    client.friends.findFriends({
      '+5555555555': 'test'
    }, function (err, results) {
      t.notOk(err)
      t.ok(results)
      t.equal(results.length, 0)
      t.end()
    })
  })


  // TODO:
  // Snapchat.friends.addFriends
  // Snapchat.friends.addFriendBack
  // Snapchat.friends.findFriends
  // Snapchat.friends.findFriendsNear
})
