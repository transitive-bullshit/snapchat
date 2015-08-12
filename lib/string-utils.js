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
  return '' + date.getTime()
}

/**
 * @param {string} data
 * @return {string}
 */
StringUtils.hashHMacToBase64 = function (data, key) {
  return crypto.createHMac('sha256', key).update(data).digest('base64')
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
  return username + '|' + password + '|' + timestamp + '|' + constants.endpoints.account.login
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
