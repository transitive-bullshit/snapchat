module.exports = BufferUtils

var crypto = require('crypto')
var constants = require('./constants')

/**
 * @namespace
 * @static
 */
function BufferUtils () {
  // static class
}

/**
 * @param {Buffer} data
 * @return {boolean}
 */
BufferUtils.isJPEG = function (data) {
  var h = BufferUtils._getHeader(data)

  return h && h.a === 0xFF && h.b === 0xD8 && h.c === 0xFF && (h.d === 0xE0 || h.d === 0xE1 || h.d === 0xE8)
}

/**
 * @param {Buffer} data
 * @return {boolean}
 */
BufferUtils.isPNG = function (data) {
  var h = BufferUtils._getHeader(data)

  return h && h.a === 0x89 && h.b === 0x50 && h.c === 0x4E && h.d === 0x47
}

/**
 * @param {Buffer} data
 * @return {boolean}
 */
BufferUtils.isImage = function (data) {
  return BufferUtils.isJPEG(data) || BufferUtils.isPNG(data)
}

/**
 * @param {Buffer} data
 * @return {boolean}
 */
BufferUtils.isMPEG4 = function (data) {
  var h = BufferUtils._getHeader(data)

  return h && h.a === 0x00 && h.b === 0x00 && h.c === 0x00 && (h.d === 0x14 || h.d === 0x18 || h.d === 0x1C)
}

/**
 * @param {Buffer} data
 * @return {boolean}
 */
BufferUtils.isMedia = function (data) {
  return BufferUtils.isImage(data) || BufferUtils.isMPEG4(data)
}

/**
 * @param {Buffer} data
 * @return {boolean}
 */
BufferUtils.isCompressed = function (data) {
  var h = BufferUtils._getHeader(data)

  return h && h.a === 0x50 && h.b === 0x4B && h.c === 0x03 && h.d === 0x04
}

/**
 * @param {Buffer} data
 * @return {Object}
 */
BufferUtils._getHeader = function (data) {
  if (!data || data.length < 4) {
    return null
  } else {
    return {
      a: data.readUInt8(0),
      b: data.readUInt8(1),
      c: data.readUInt8(2),
      d: data.readUInt8(3)
    }
  }
}

/**
 * @param {Buffer} data
 * @return {string}
 */
BufferUtils.getFileExtension = function (data) {
  if (BufferUtils.isJPEG(data)) return '.jpg'
  if (BufferUtils.isPNG(data)) return '.png'
  if (BufferUtils.isMPEG4(data)) return '.mp4'
  if (BufferUtils.isCompressed(data)) return '.zip'
  return '.dat'
}

/**
 * @param {Buffer} data
 * @return {string}
 */
BufferUtils.sha256HashToBase64 = function (data) {
  return crypto.createHash('sha256').update(data).digest('base64')
}

/**
 * @param {Buffer} data
 * @return {string}
 */
BufferUtils.sha256HashToHex = function (data) {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * @param {Buffer} a
 * @param {Buffer} b
 * @return {string}
 */
BufferUtils.hashSC = function (a, b) {
  var secret = new Buffer(constants.core.secret)

  var firstData = Buffer.concat([ secret, a ])
  var secondData = Buffer.concat([ b, secret ])

  var first = BufferUtils.sha256HashToHex(firstData)
  var second = BufferUtils.sha256HashToHex(secondData)

  var pattern = constants.core.hashPattern
  var hash = ''

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
 * Decrypts Buffer data for stories.
 *
 * @param {Buffer} data
 * @param {string} key (base64)
 * @param {string} iv (base64)
 * @return {Buffer}
 */
BufferUtils.decryptStory = function (data, key, iv) {
  if (!data || !key || !iv) throw new Error('BufferUtils.decryptStory invalid params')

  var keyBuffer = new Buffer(key, 'base64')
  var ivBuffer = new Buffer(iv, 'base64')

  return BufferUtils.AES128DecryptedData(data, keyBuffer, ivBuffer)
}

/**
 * Decrypts Buffer data for stories.
 *
 * @param {Buffer} data
 * @param {Buffer} key
 * @param {Buffer} iv
 * @return {Buffer}
 */
BufferUtils.AES128DecryptedData = function (data, key, iv) {
  var keyLength = (key.length >= 32 ? 32 : 16)
  var algorithm = (keyLength === 32 ? 'aes-256-cbc' : 'aes-128-cbc')
  var cipher = crypto.createDecipheriv(algorithm, key.slice(0, keyLength), iv.slice(0, 16))

  return Buffer.concat([
    cipher.update(data),
    cipher.final()
  ])
}
