var test = require('tape')
var Snapchat = require('../')

test('Snapchat.registerEmail', function (t) {
  var client = new Snapchat()

  client.registerEmail('fisch0920@gmail.com', 'Testpassword7', '1993-08-13', function (err, result) {
    console.log(result)
    t.notOk(err)
    t.ok(result)
    t.ok(result['email'])
    t.ok(result['snapchat_phone_number'])
    t.ok(result['username_suggestions'])
    t.end()
  })
})
