#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')
var constants = require('../lib/constants')
var Snapchat = require('../')

var client = new Snapchat()

client.signIn(function (err) {
  if (err) throw new Error('signIn error', err)

  test('Snapchat.account.updateBestFriendsCount', function (t) {
    client.account.updateBestFriendsCount(4, function (err) {
      t.notOk(err)
      t.end()
    })
  })

  test('Snapchat.account.updateSnapPrivacy', function (t) {
    client.account.updateSnapPrivacy(constants.SnapPrivacy.Friends.value, function (err) {
      t.notOk(err)
      t.end()
    })
  })

  test('Snapchat.account.updateStoryPrivacy', function (t) {
    client.account.updateStoryPrivacy(constants.StoryPrivacy.Friends.value, function (err) {
      t.notOk(err)
      t.end()
    })
  })

  test('Snapchat.account.updateSearchableByNumber', function (t) {
    client.account.updateSearchableByNumber(false, function (err) {
      t.notOk(err)
      t.end()
    })
  })

  test('Snapchat.account.updateNotificationSoundSetting', function (t) {
    client.account.updateNotificationSoundSetting(true, function (err) {
      t.notOk(err)
      t.end()
    })
  })

  test('Snapchat.account.updateDisplayName', function (t) {
    client.account.updateDisplayName('testing123', function (err) {
      t.notOk(err)
      t.end()
    })
  })

  /* TODO: this is currently broken; need to parse the SVG
  test('Snapchat.account.downloadSnaptag', function (t) {
    client.account.downloadSnaptag(function (err, blob) {
      t.notOk(err)
      t.ok(blob)
      t.end()
    })
  })*/

  // TODO:
  // Snapchat.account.updateEmail
  // Snapchat.account.updateFeatureSettings
  // Snapchat.account.uploadAvatar
  // Snapchat.account.downloadAvatar
  // Snapchat.account.updateTOSAgreementStatus
})
