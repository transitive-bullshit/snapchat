var test = require('tape')

var constants = require('../lib/constants')
var Request = require('../lib/request')

test('request ping', function (t) {
  var request = Request.post(constants.endpoints.misc.ping, { }, null, constants.core.staticToken, function (err, response, body) {
    console.log(request)
    console.log(err)
    console.log(response)
    console.log(body)
    t.end()
  })
})
