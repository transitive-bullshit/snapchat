module.exports = UserStory

var StoryNote = require('./story-note')

/**
 * Snapchat UserStory
 *
 * @class
 * @param {Object} params
 */
function UserStory (params) {
  var self = this
  if (!(self instanceof UserStory)) return new UserStory(params)

  var extras = params['story_extras']
  var storyNotes = params['story_notes']

  self.screenshotCount = extras['screenshot_count'] | 0
  self.viewCount = extras['view_count'] | 0

  self.notes = (storyNotes || [ ]).map(function (note) {
    return new StoryNote(note)
  })
}
