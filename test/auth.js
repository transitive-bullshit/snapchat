#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')
var Snapchat = require('../')

var SNAPCHAT_USERNAME = process.env.SNAPCHAT_USERNAME
var SNAPCHAT_PASSWORD = process.env.SNAPCHAT_PASSWORD
var GMAIL_EMAIL = process.env.GMAIL_EMAIL
var GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

var HAS_AUTH = SNAPCHAT_USERNAME && SNAPCHAT_PASSWORD && GMAIL_EMAIL && GMAIL_PASSWORD

if (!HAS_AUTH) {
  console.error("error missing required auth variables in environment")
  process.exit(1)
}

test('Snapchat._getGoogleAuthToken', function (t) {
  var client = new Snapchat()

  client._getGoogleAuthToken(GMAIL_EMAIL, GMAIL_PASSWORD, function (err, result) {
    t.notOk(err)
    t.ok(result)
    t.equal(typeof result, 'string')
    t.end()
  })
})
