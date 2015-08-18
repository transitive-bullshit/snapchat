#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')

var StringUtils = require('../lib/string-utils')

test('timestamp', function (t) {
  var timestamp = StringUtils.timestamp()
  t.ok(timestamp)
  t.equal(typeof timestamp, 'string')
  t.equal(typeof +timestamp, 'number')
  t.ok(new Date(+timestamp) < new Date())
  t.end()
})
