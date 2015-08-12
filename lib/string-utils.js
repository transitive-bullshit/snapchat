module.exports = StringUtils

var crypto = require('crypto')
var constants = require('./constants')

function StringUtils () {
  // static class
}

StringUtils.timestamp = function () {
  return StringUtils.timestampFrom(new Date())
}

StringUtils.timestampFrom = function (date) {
  return '' + date.value
}

/**
 * @param {Buffer} data
 * @return {string}
 */
StringUtils.sha256Hash = function (data) {
  return crypto.createHash('sha256').update(data).digest('base64')
}

/**
 * @param {Buffer} data
 * @return {Buffer}
 */
StringUtils.sha256HashRaw = function (data) {
  return new Buffer(StringUtils.sha256Hash(data))
}

/**
 * @param {string} first
 * @param {string} second
 * @return {string}
 */
StringUtils.hashSCString = function (first, second) {
  return StringUtils.hashSC(new Buffer(first), new Buffer(second))
}

/**
 * @param {Buffer} a
 * @param {Buffer} b
 * @return {string}
 */
StringUtils.hashSC = function (a, b) {
  var secret = new Buffer(constants.core.secret)

  var firstData = Buffer.concat(secret, a)
  var secondData = Buffer.concat(b, secret)

  var first = StringUtils.sha256Hash(firstData)
  var second = StringUtils.sha256Hash(secondData)

  var hash = ''
  var pattern = constants.core.hashPattern

  for (var i = 0; i < pattern.length; ++i) {
    if (pattern.charAt(i) === '0') {
      hash += first.charAt(i)
    } else {
      hash += second.charAt(i)
    }
  }

  return hash
}
