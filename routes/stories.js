module.exports = Stories

var debug = require('debug')('snapchat:request')
var request = require('request')
var urljoin = require('url-join')
var extend = require('xtend')

var StringUtils = require('./string-utils')
var constants = require('./constants')

/**
 * Snapchat wrapper for HTTP requests
 *
 * @param {Object} opts
 */
function Stories (opts) {
  var self = this
  if (!(self instanceof Stories)) return new Stories(opts)
  if (!opts) opts = {}
}

/**
 * Posts a story with the given options.
 * @param blob The \c SKBlob object containing the image or video data to send. Can be created with any \c NSData object.
 * @param options The options for the story to post.
 * @param completion Takes an error, if any.
 */
- (void)postStory:(SKBlob *)blob options:(SKStoryOptions *)options completion:(ErrorBlock)completion;

/**
 * Downloads media for a story.
 * @param story The story to download.
 * @param completion Takes an error, if any, and an \c SKBlob object.
 */
- (void)loadStoryBlob:(SKStory *)story completion:(ResponseBlock)completion;

/**
 * Downloads the thumbnail for a story.
 * @param story The story whose thumbnail you wish to download.
 * @param completion Takes an error, if any, and an \c SKBlob object.
 */
- (void)loadStoryThumbnailBlob:(SKStory *)story completion:(ResponseBlock)completion;

/**
 * Batch loads media for a set of stories.
 * @param stories An array of \c SKStory objects whose media you wish to download.
 * @param completion Takes an error, if any, an array of \c SKStory objects with initialized \c blob properties, and an array of \c SKStory objects that could not be retrieved, if any.
 */
- (void)loadStories:(NSArray *)stories completion:(CollectionResponseBlock)completion;

/**
 * Deletes a story of yours.
 * @param completion Takes an error, if any.
 */
- (void)deleteStory:(SKUserStory *)story completion:(ErrorBlock)completion;

/**
 * Marks a set of stories as opened.
 * @param stories An array of \c SKStoryUpdater objects.
 * @param completion Takes an error, if any.
 */
- (void)markStoriesViewed:(NSArray *)stories completion:(ErrorBlock)completion;

/**
 * Marks a single story opened.
 * @discussion To batch mark stories viewed, use \c -markStoriesViewed:completion:.
 * @param story The story to mark as opened.
 * @param sscount The number of times the story was screenshotted.
 * @param completion Takes an error, if any.
 */
- (void)markStoryViewed:(SKStory *)story screenshotCount:(NSUInteger)sscount completion:(ErrorBlock)completion;

/**
 * Hides a shared story from the story feed.
 * @param completion Takes an error, if any.
 */
- (void)hideSharedStory:(SKStoryCollection *)story completion:(ErrorBlock)completion;

/**
 * I forget what this is for. Does nothing if the story is not a shared story.
 * @param sharedStory A shared story.
 * @param completion Takes an error, if any.
 */
- (void)provideSharedDescription:(SKStory *)sharedStory completion:(ErrorBlock)completion;

/**
 * Retrieves the description for a shared story.
 * @param sharedStory A shared story.
 * @param completion Takes an error, if any, and an \c SKSharedStoryDescription object.
 */
- (void)getSharedDescriptionForStory:(SKUser *)sharedStory completion:(ResponseBlock)completion;
