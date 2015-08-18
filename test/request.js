#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')

var constants = require('../lib/constants')
var Request = require('../lib/request')

test('request /loq/ping', function (t) {
  Request.post(constants.endpoints.misc.ping, function (err, result) {
    t.notOk(err)
    t.ok(result)
    t.ok(result.timestamp)
    t.end()
  })
})
