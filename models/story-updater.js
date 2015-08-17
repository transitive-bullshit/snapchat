module.exports = StoryUpdater

/**
 * Snapchat StoryUpdater
 *
 * @param {string} storyID
 * @param {string} timestamp
 * @param {number} screenshotCount
 */
function StoryUpdater (storyID, timestamp, screenshotCount) {
  var self = this
  if (!(self instanceof StoryUpdater)) return new StoryUpdater(storyID, timestamp, screenshotCount)

  self.storyID = storyID
  self.timestamp = timestamp
  self.screenshotCount = screenshotCount
}
