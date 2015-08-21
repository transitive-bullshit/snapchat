#!/usr/bin/env node

require('dotenv').load()

var TEST_USERNAME = 'teamsnapchat'

var test = require('tape')
var fs = require('fs')
var Snapchat = require('../')
var SKBlob = require('../models/blob')

var client = new Snapchat()
var opts

var imageBlob0 = new SKBlob(fs.readFileSync(__dirname + '/data/out1.jpg', opts))
var imageBlob1 = new SKBlob(fs.readFileSync(__dirname + '/data/out2.jpg', opts))
var videoBlob = new SKBlob(fs.readFileSync(__dirname + '/data/out.mp4', opts))

client.signIn(function (err) {
  if (err) throw new Error('signIn error', err)

  test('Snapchat.snaps.sendSnap => image (0)', function (t) {
    t.ok(imageBlob0.isImage)
    t.ok(!imageBlob0.isVideo)
    client.snaps.sendSnap(imageBlob0, TEST_USERNAME, 'hello', 3, function (err) {
      t.notOk(err)
    })
  })

  /*test('Snapchat.snaps.sendSnap => image (1)', function (t) {
    t.ok(imageBlob1.isImage)
    t.ok(!imageBlob1.isVideo)
    client.snaps.sendSnap(imageBlob1, TEST_USERNAME, 'hola', 5, function (err) {
      t.notOk(err)
    })
  })

  test('Snapchat.snaps.sendSnap => video', function (t) {
    t.ok(!videoBlob.isImage)
    t.ok(videoBlob.isVideo)
    client.snaps.sendSnap(videoBlob, TEST_USERNAME, 'welcome!', 5, function (err) {
      t.notOk(err)
    })
  })*/

  // TODO:
  //
})
