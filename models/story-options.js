module.exports = StoryOptions

/**
 * Snapchat StoryOptions
 *
 * @param {string} text
 * @param {number} timer
 * @param {boolean} cameraFrontFacing
 */
function StoryOptions (text, timer, cameraFrontFacing) {
  var self = this
  if (!(self instanceof StoryOptions)) return new StoryOptions(text, timer, cameraFrontFacing)

  self.text = text
  self.timer = timer || 3
  self.cameraFrontFacing = !!cameraFrontFacing
}
