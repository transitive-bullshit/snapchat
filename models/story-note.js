module.exports = StoryNote

/**
 * Snapchat StoryNote
 *
 * @class
 *
 * @param {Object} params
 */
function StoryNote (params) {
  var self = this
  if (!(self instanceof StoryNote)) return new StoryNote(params)

  // who viewed the story
  self.viewer = params['viewer']

  // when the story was viewed by the viewer
  self.viewDate = new Date(+params['timestamp'])

  // whether or not the viewer took a screenshot of the story
  self.screenshot = !!params['screenshotted']

  // obscure data. not sure what is's for but it has the following format:
  // {
  //   mField : "123456.023Z"
  //   mId    : "username~unixtime"
  //   mKey   : "story:{username}:YYYYMMDD"
  // }
  self.storyPointer = params['storypointer']
}
