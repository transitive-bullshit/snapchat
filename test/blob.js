#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')
var request = require('request')

var Snapchat = require('../')
var SKBlob = require('../models/blob')
var Story = require('../models/story')
var BufferUtils = require('../lib/buffer-utils')

var client = new Snapchat()

// example public story from teamsnapchat
var story = new Story(client, {
  "id": "teamsnapchat~10",
  "username": "teamsnapchat",
  "mature_content": false,
  "client_id": "teamsnapchat~ENGLISH~10",
  "timestamp": 1439886869187,
  "media_id": "teamsnapchat~ENGLISH~10",
  "media_key": "Ceo15UEA4H6h/cfznmjCDDBL2DAMV210L7BrvuPPWKA=",
  "media_iv": "IlJZE6d74icg2AULnYFOXQ==",
  "thumbnail_iv": "IlJZE6d74icg2AULnYFOXQ==",
  "media_type": 1,
  "time": 5,
  "zipped": false,
  "story_filter_id": "",
  "is_shared": false,
  "time_left": 86489911,
  "media_url": "https://feelinsonice-hrd.appspot.com/bq/story_blob?story_id=teamsnapchat~ENGLISH~10&t=2&mt=1",
  "thumbnail_url": "https://feelinsonice-hrd.appspot.com/bq/story_thumbnail?story_id=teamsnapchat~ENGLISH~10&t=2&mt=1",
  "needs_auth": false,
  "ad_can_follow": true
})

test('SKBlob.initWithStoryData', function (t) {
  request(story.mediaURL, { encoding: null }, function (err, response, body) {
    t.notOk(err)
    t.ok(body)
    t.notOk(BufferUtils.isCompressed(body))
    t.notOk(BufferUtils.isMedia(body))
    SKBlob.initWithStoryData(body, story, function (err, blob) {
      t.notOk(err)
      t.ok(blob)
      t.ok(blob.isMedia)
      t.ok(blob.isVideo)
      t.end()
    })
  })
})
