#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')

var Snapchat = require('../')
var Session = require('../models/session')
var StringUtils = require('../lib/string-utils')

var SNAPCHAT_USERNAME = process.env.SNAPCHAT_USERNAME
var SNAPCHAT_PASSWORD = process.env.SNAPCHAT_PASSWORD
var GMAIL_EMAIL = process.env.GMAIL_EMAIL
var GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

var HAS_AUTH = SNAPCHAT_USERNAME && SNAPCHAT_PASSWORD && GMAIL_EMAIL && GMAIL_PASSWORD

if (!HAS_AUTH) {
  console.error("error missing required auth variables in environment")
  process.exit(1)
}

/*test('Snapchat._getGoogleAuthToken', function (t) {
  var client = new Snapchat()

  client._getGoogleAuthToken(GMAIL_EMAIL, GMAIL_PASSWORD, function (err, result) {
    t.notOk(err)
    t.ok(result)
    t.equal(typeof result, 'string')
    t.end()
  })
})

test('Snapchat._getAttestation', function (t) {
  var client = new Snapchat()

  var timestamp = StringUtils.timestamp()

  client._getAttestation(SNAPCHAT_USERNAME, SNAPCHAT_PASSWORD, timestamp, function (err, result) {
    t.notOk(err)
    t.ok(result)
    t.ok(result.length)
    t.equal(typeof result, 'string')
    t.end()
  })
})

test('Snapchat._getGoogleCloudMessagingIdentifier', function (t) {
  var client = new Snapchat()

  client._getGoogleCloudMessagingIdentifier(function (err, result) {
    t.notOk(err)
    t.ok(result)
    t.ok(result.length)
    t.equal(typeof result, 'string')
    t.end()
  })
})*/

test('Snapchat.signIn', function (t) {
  var client = new Snapchat()

  client.signIn(SNAPCHAT_USERNAME, SNAPCHAT_PASSWORD, GMAIL_EMAIL, GMAIL_PASSWORD, function (err, session) {
    t.notOk(err)
    t.ok(session)
    t.ok(session instanceof Session)
    t.ok(client.isSignedIn)
    t.equal(client.username, SNAPCHAT_USERNAME)
    t.ok(client.authToken)
    t.ok(client.googleAuthToken)
    t.ok(client.deviceToken1i)
    t.ok(client.deviceToken1v)
    t.end()
  })
})
