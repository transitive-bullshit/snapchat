var test = require('tape')

var constants = require('../lib/constants')
var Request = require('../lib/request')

test('request ping', function (t) {
  Request.post(constants.endpoints.misc.ping, function (err, response, body) {
    t.notOk(err)
    t.equal(response.statusCode, 200)
    t.ok(body)
    t.equal(body.length, 0)
    t.end()
  })
})
