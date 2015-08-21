#!/usr/bin/env node

require('dotenv').load()

var test = require('tape')
var request = require('request')

var Snapchat = require('../')
var SKBlob = require('../models/blob')
var Story = require('../models/story')
var BufferUtils = require('../lib/buffer-utils')

var client = new Snapchat()

// example public story from teamsnapchat (mp4 video)
var videoStory = new Story(client, {
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

var imageStory = new Story(client, {
  "id":"nolalive1~1439877619384~63249210",
  "username":"nolalive1",
  "mature_content":false,
  "client_id":"NOLALIVE1~DCE63F98-9679-4C96-9ACC-DBAF1FD3F8B7",
  "timestamp":1439877619384,
  "media_id":"5597917908992000",
  "media_key":"4CkajFpxAsFzEuUzHnMsCK1sZ9JIhzlmAMnyBvHBnPg=",
  "media_iv":"shBkkZmR+p/MOcYDRR6KJQ==",
  "thumbnail_iv":"kx+a91cfEQVHLKZmMKBLsw==",
  "media_type":0,
  "time":5,
  "caption_text_display":"Goodnight, New Orleans 🌙",
  "zipped":false,
  "story_filter_id":"",
  "is_shared":true,
  "time_left":77240108,
  "media_url":"https://feelinsonice-hrd.appspot.com/bq/story_blob?story_id=5597917908992000&t=0&mt=0",
  "thumbnail_url":"https://feelinsonice-hrd.appspot.com/bq/story_thumbnail?story_id=5597917908992000&t=0&mt=0",
  "needs_auth":false,
  "ad_can_follow":true
})

var imageStory2 = new Story(client, {
  "id":"nolalive1~1439862390520~869332c6",
  "username":"nolalive1",
  "mature_content":false,
  "client_id":"NOLALIVE1~C26C38FE-DEB5-4B9A-9AF5-D22798666F77",
  "timestamp":1439862390520,
  "media_id":"4849732508876800",
  "media_key":"/DruMGsJpBDyBfZjuMbwkQiihNEtJ2rcDaqJylBV228=",
  "media_iv":"fQ7AI3bdY4o4Pie7OLnvng==",
  "thumbnail_iv":"qjYByDndJ1FFOk0SkW5aAg==",
  "media_type":0,
  "time":3,
  "caption_text_display":"Oh hey Bourbon Street",
  "zipped":false,
  "story_filter_id":"",
  "is_shared":true,
  "time_left":62011242,
  "media_url":"https://feelinsonice-hrd.appspot.com/bq/story_blob?story_id=4849732508876800&t=0&mt=0",
  "thumbnail_url":"https://feelinsonice-hrd.appspot.com/bq/story_thumbnail?story_id=4849732508876800&t=0&mt=0",
  "needs_auth":false,
  "ad_can_follow":true
})

test('SKBlob.initWithStoryData => video', function (t) {
  request(videoStory.mediaURL, { encoding: null }, function (err, response, body) {
    t.notOk(err)
    t.ok(body)
    t.notOk(BufferUtils.isCompressed(body))
    t.notOk(BufferUtils.isMedia(body))
    SKBlob.initWithStoryData(body, videoStory, function (err, blob) {
      t.notOk(err)
      t.ok(blob)
      t.ok(blob.isMedia)
      t.ok(blob.isVideo)
      t.end()
    })
  })
})

test('SKBlob.initWithStoryData => image', function (t) {
  request(imageStory.mediaURL, { encoding: null }, function (err, response, body) {
    t.notOk(err)
    t.ok(body)
    t.notOk(BufferUtils.isCompressed(body))
    t.notOk(BufferUtils.isMedia(body))
    SKBlob.initWithStoryData(body, imageStory, function (err, blob) {
      t.notOk(err)
      t.ok(blob)
      t.ok(blob.isMedia)
      t.ok(blob.isImage)
      t.end()
    })
  })
})

test('SKBlob.initWithStoryData => image (2)', function (t) {
  request(imageStory2.mediaURL, { encoding: null }, function (err, response, body) {
    t.notOk(err)
    t.ok(body)
    t.notOk(BufferUtils.isCompressed(body))
    t.notOk(BufferUtils.isMedia(body))
    SKBlob.initWithStoryData(body, imageStory2, function (err, blob) {
      t.notOk(err)
      t.ok(blob)
      t.ok(blob.isMedia)
      t.ok(blob.isImage)
      t.end()
    })
  })
})

test('SKBlob.initWithStoryData => image (2)', function (t) {
  request(imageStory2.mediaURL, { encoding: null }, function (err, response, body) {
    t.notOk(err)
    t.ok(body)
    t.notOk(BufferUtils.isCompressed(body))
    t.notOk(BufferUtils.isMedia(body))
    SKBlob.initWithStoryData(body, imageStory2, function (err, blob) {
      t.notOk(err)
      t.ok(blob)
      t.ok(blob.isMedia)
      t.ok(blob.isImage)
      t.end()
    })
  })
})
