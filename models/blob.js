module.exports = SKBlob

/**
 * Snapchat Blob wrapper
 *
 * @param {Object} params
 */
function SKBlob (params) {
  var self = this
  if (!(self instanceof SKBlob)) return new SKBlob(params)


  throw new Error("TODO")
}

/**
 * The underlying data for the image or video.
 *
 * @type {Buffer}
 */
Object.defineProperty(SKBlob.prototype, 'data', {
  get: function () { return this._data }
})

/**
 * The overlay for the video if applicable.
 *
 * @type {Buffer}
 */
Object.defineProperty(SKBlob.prototype, 'overlay', {
  get: function () { return this._overlay }
})

/**
 * Whether or not this blob represents an image (PNG or JPEG).
 *
 * @type {boolean}
 */
Object.defineProperty(SKBlob.prototype, 'isImage', {
  get: function () { return this._isImage }
})

/**
 * Whether or not this blob represents a video (MPEG4).
 *
 * @type {boolean}
 */
Object.defineProperty(SKBlob.prototype, 'isVideo', {
  get: function () { return !this._isImage }
})
