module.exports = StringUtils

var crypto = require('crypto')
var constants = require('./constants')
var uuid = require('node-uuid')

function StringUtils () {
  // static class
}

StringUtils.timestamp = function () {
  return StringUtils.timestampFrom(new Date())
}

StringUtils.timestampFrom = function (date) {
  return '' + date.getTime()
}

/**
 * @param {string} str
 * @param {string} key
 * @return {string}
 */
StringUtils.hashHMacToBase64 = function (str, key) {
  return crypto.createHMac('sha256', key).update(data).digest('base64')
}

/**
 * @param {string} str
 * @return {string}
 */
StringUtils.md5HashToHex = function (str) {
  return crypto.createHash("md5").update(str).digest("hex")
}

/**
 * @param {Buffer} data
 * @return {string}
 */
StringUtils.sha256HashToBase64 = function (data) {
  return crypto.createHash('sha256').update(data).digest('base64')
}

/**
 * @param {Buffer} data
 * @return {string}
 */
StringUtils.sha256HashToHex = function (data) {
  return crypto.createHash('sha256').update(data).digest('hex')
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

  var firstData = Buffer.concat([ secret, a ])
  var secondData = Buffer.concat([ b, secret ])

  var first = StringUtils.sha256HashToHex(firstData)
  var second = StringUtils.sha256HashToHex(secondData)

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

/**
 * Returns the pre-hash string used for Snapchat requests.
 *
 * @param {string} username
 * @param {string} password
 * @param {string} timestamp
 * @param {string} endpoint
 * @return {string}
 */
StringUtils.getSCPreHashString = function (username, password, timestamp, endpoint) {
  return username + '|' + password + '|' + timestamp + '|' + endpoint
}

/**
 * Attempts to parse the given string as JSON, returning null upon parse error.
 *
 * @param {string} input
 * @return {Object}
 */
StringUtils.tryParseJSON = function (input) {
  try {
    return JSON.parse(input)
  } catch (e) {
    return null
  }
}

StringUtils.matchGroup = function (input, regex, index) {
  var matches = input.match(regex)

  if (matches && index < matches.length) {
    return matches[index]
  } else {
    return null
  }
}

/**
 * @param {string} sender
 * @return {string}
 */
StringUtils.mediaIdentifer = function (sender) {
  var hash = StringUtils.md5HashToHex(uuid.v4())
  return sender.toUpperCase() + '~' + hash
}

/**
 * @return {string}
 */
StringUtils.uniqueIdentifer = function () {
  var hash = StringUtils.md5HashToHex(uuid.v4())
  return hash.substr(0, 8) + '-' +
    hash.substr(8, 4) + '-' +
    hash.substr(12, 4) + '-' +
    hash.substr(16, 4) + '-' +
    hash.substr(20, 12)
}
