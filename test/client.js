#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')
var Snapchat = require('../')

test('Snapchat.registerEmail', function (t) {
  var client = new Snapchat()

  // note: it's okay to register an email multiple times without completing signup
  client.registerEmail('test@textblast.io', 'Testpassword7', '1994-03-20', function (err, result) {
    t.notOk(err)
    t.ok(result)
    t.ok(result['email'])
    t.ok(result['snapchat_phone_number'])
    t.ok(result['username_suggestions'])
    t.end()
  })
})

test('Snapchat._getDeviceTokens', function (t) {
  var client = new Snapchat()

  client._getDeviceTokens(function (err, result) {
    t.notOk(err)
    t.ok(result)
    t.ok(result.dtoken1i)
    t.ok(result.dtoken1v)
    t.end()
  })
})
