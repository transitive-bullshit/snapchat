#!/usr/bin/env node

require('dotenv').load()

var TEST_USERNAME = 'teamsnapchat'
var TEST_BLOCK_USERNAME = 'sam'

var test = require('tape')
var Snapchat = require('../')

var client = new Snapchat()

client.signIn(function (err) {
  if (err) throw new Error('signIn error', err)

  test('Snapchat.friends.unfriend', function (t) {
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
  })

  test('Snapchat.friends.findFriends', function (t) {
    client.friends.findFriends({
      '+5555555555': 'test'
    }, function (err, results) {
      t.notOk(err)
      t.ok(results)
      t.ok(results.length >= 1)
      t.equal(results.filter(function (result) {
        return result.username ===  'lovealways_cma'
      }).length, 1)
      t.end()
    })
  })

  test('Snapchat.friends.userExists => true', function (t) {
    client.friends.userExists(TEST_USERNAME, function (err, exists) {
      t.notOk(err)
      t.ok(exists)

      client.friends.userExists('fisch0920', function (err, exists) {
        t.notOk(err)
        t.ok(exists)
        t.end()
      })
    })
  })

  test('Snapchat.friends.userExists => false', function (t) {
    client.friends.userExists('_02a3lkj3o2i32l3inl', function (err, exists) {
      t.notOk(err)
      t.notOk(exists)
      t.end()
    })
  })

  test('Snapchat.friends.blockUser', function (t) {
    client.friends.blockUser(TEST_BLOCK_USERNAME, function (err) {
      t.notOk(err)
      t.end()
    })
  })

  test('Snapchat.friends.unblockUser', function (t) {
    client.friends.unblockUser(TEST_BLOCK_USERNAME, function (err) {
      t.notOk(err)
      t.end()
    })
  })

  /*
  // TODO: currently failing with a 400 Bad Request
  test('Snapchat.friends.findFriendsNear', function (t) {
    client.friends.findFriendsNear({
      // new york city
      lat: '40.7127',
      lng: '74.0059'
    }, 1000, 0, function (err, results) {
      t.notOk(err)
      console.log(results)
      t.ok(results)
      t.end()
    })
  })

  // TODO: currently failing with parse error {"message":"Something went wrong.","logged":false}
  test('Snapchat.friends.updateDisplayNameForUser', function (t) {
    var username = client.session.friends[0].username
    var testDisplayName = 'nala sandwich'

    client.friends.updateDisplayNameForUser(username, testDisplayName, function (err) {
      t.notOk(err)
      client.updateSession(function (err) {
        t.notOk(err)
        // ensure friend's display name has been updated
        t.equal(client.session.getFriend(username).displayname, testDisplayName)
        t.end()
      })
    })
  })*/

  // TODO:
  // Snapchat.friends.addFriends
  // Snapchat.friends.addFriendBack
  // Snapchat.friends.searchFriend
  // Snapchat.friends.seenSuggestedFriends
})
