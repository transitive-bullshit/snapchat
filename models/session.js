module.exports = Session

var constants = require('../lib/constants')
var Snapchat = require('../')
var User = require('./user')
var Conversation = require('./conversation')
var UserStory = require('./user-story')
var StoryCollection = require('./story-collection')

/**
 * Snapchat Session
 *
 * @class
 * @param {Snapchat} client
 * @param {Object} params
 */
function Session (client, params) {
  var self = this
  if (!(self instanceof Session)) return new Session(client, params)
  if (!(client instanceof Snapchat)) throw new Error('invalid client')

  self.client = client

  var storiesResponse = params['stories_response']
  var friendsResponse = params['friends_response']
  var updatesResponse = params['updates_response']
  var identity = params['identity_check_response']
  var features = updatesResponse['feature_settings']
  var discover = params['discover']
  var messagingGate = params['messaging_gateway_info']

  var friendStories = storiesResponse['friend_stories'] || []
  var myStories = storiesResponse['my_stories'] || []
  // var groupStories = storiesResponse['my_group_stories'] || []

  var friends = friendsResponse['friends'] || []
  var addedFriends = friendsResponse['added_friends'] || []
  var conversations = params['conversations_response'] || []

  self.backgroundFetchSecret = params['background_fetch_secret_key']
  self.bestFriendUsernames = friendsResponse['bests'] || []

  self.storiesDelta = !!storiesResponse['friend_stories_delta']
  self.emailVerified = !!identity['is_email_verified']
  self.highAccuracyRequiredForNearby = !!identity['is_high_accuracy_required_for_nearby']
  self.requirePhonePasswordConfirmed = !!identity['require_phone_password_confirmed']
  self.redGearDurationMilliseconds = +identity['red_gear_duration_millis']
  self.suggestedFriendFetchThresholdHours = identity['suggested_friend_fetch_threshold_hours'] | 0

  self.messagingGatewayAuth = messagingGate['gateway_auth_token']
  self.messagingGatewayServer = messagingGate['gateway_server']

  // Discover
  self.discoverSupported = (discover['compatibility'] === 'supported')
  self.discoverSharingEnabled = !!discover['sharing_enabled']
  self.discoverGetChannels = discover['get_channels']
  self.discoverResourceParamName = discover['resource_parameter_name']
  self.discoverResourceParamValue = discover['resource_parameter_value']
  self.discoverVideoCatalog = discover['video_catalog']

  // Friends
  self.friends = friends.map(function (friend) {
    return new User(friend)
  })

  // Added friends
  self.addedFriends = addedFriends.map(function (friend) {
    return new User(friend)
  })

  // Conversations
  self.conversations = conversations.map(function (conversation) {
    return new Conversation(conversation)
  })

  // Story collections
  self.stories = friendStories.map(function (collection) {
    return new StoryCollection(self.client, collection)
  })

  // User stories
  self.userStories = myStories.map(function (story) {
    return new UserStory(story)
  })

  // Group stories?
  self.groupStories = [ ] // TODO

  // Added me but not added back
  self.pendingRequests = [ ] // TODO

  // Cash info
  self.canUseCash = !!updatesResponse['allowed_to_use_cash']
  self.isCashActive = !!updatesResponse['is_cash_active']
  self.cashCustomerIdentifier = updatesResponse['cash_customer_id']
  self.cashClientProperties = updatesResponse['client_properties']
  self.cashProvider = updatesResponse['cash_provider']

  // Basic user info
  self.username = updatesResponse['username']
  self.email = updatesResponse['email']
  self.mobileNumber = updatesResponse['mobile']
  self.recieved = updatesResponse['recieved'] | 0
  self.sent = updatesResponse['sent'] | 0
  self.score = updatesResponse['score'] | 0
  self.recents = updatesResponse['recents'] || []
  self.requests = updatesResponse['requests'] || []

  // Account information
  self.addedFriendsTimestamp = new Date(updatesResponse['added_friends_timestamp'])
  self.authToken = updatesResponse['auth_token']
  self.canSeeMatureContent = !!updatesResponse['can_view_mature_content']
  self.countryCode = updatesResponse['country_code'] || 'US'
  self.lastTimestamp = new Date(updatesResponse['cash_provider'])
  self.devicetoken = updatesResponse['device_token']
  self.canSaveStoryToGallery = !!updatesResponse['enable_save_story_to_gallery']
  self.canVideoTranscodingAndroid = !!updatesResponse['enable_video_transcoding_android']
  self.imageCaption = !!updatesResponse['image_caption']
  self.requireRefreshingProfileMedia = !!updatesResponse['require_refreshing_profile_media']
  self.isTwoFAEnabled = !!updatesResponse['is_two_fa_enabled']
  self.lastAddressBookUpdateDate = new Date(updatesResponse['last_address_book_updated_date'])
  self.lastReplayedSnapDate = new Date(updatesResponse['last_replayed_snap_timestamp'])
  self.logged = !!updatesResponse['logged']
  self.mobileVerificationKey = updatesResponse['mobile_verification_key']
  self.canUploadRawThumbnail = !!updatesResponse['raw_thumbnail_upload_enabled']
  self.seenTooltips = updatesResponse['seen_tooltips']
  self.shouldCallToVerifyNumber = !!updatesResponse['should_call_to_verify_number']
  self.shouldTextToVerifyNumber = !!updatesResponse['should_send_text_to_verify_number']
  self.snapchatPhoneNumber = updatesResponse['snapchat_phone_number']
  self.studySettings = updatesResponse['study_settings']
  self.targeting = updatesResponse['targeting']
  self.userIdentifier = updatesResponse['user_id']
  self.videoFiltersEnabled = !!updatesResponse['video_filters_enabled']
  self.QRPath = updatesResponse['qr_path']

  // Preferences
  self.enableNotificationSounds = !!updatesResponse['notification_sound_setting']
  self.numberOfBestFriends = updatesResponse['number_of_best_friends'] | 0
  self.privacyEveryone = !updatesResponse['snap_p']
  self.isSearchableByPhoneNumber = !!updatesResponse['searchable_by_phone_number']
  // self.storyPrivacy = SKStoryPrivacyFromString(updatesResponse['story_privacy']) // TODO

  // Features
  self.enableFrontFacingFlash = !!features[constants.featureSettings.frontFacingFlash]
  self.enablePowerSaveMode = !!features[constants.featureSettings.powerSaveMode]
  self.enableReplaySnaps = !!features[constants.featureSettings.replaySnaps]
  self.enableSmartFilters = !!features[constants.featureSettings.smartFilters]
  self.enableSpecialText = !!features[constants.featureSettings.specialText]
  self.enableSwipeCashMode = !!features[constants.featureSettings.swipeCashMode]
  self.enableVisualFilters = !!features[constants.featureSettings.visualFilters]
  self.enableTravelMode = !!features[constants.featureSettings.travelMode]
}

/**
 * @param {string} username
 * @return {User|null}
 */
Session.prototype.getFriend = function (username) {
  var self = this

  for (var i = 0; i < self.friends.length; ++i) {
    var friend = self.friends[i]

    if (friend.username === username) {
      return friend
    }
  }

  return null
}
