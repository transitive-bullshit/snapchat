/* jshint -W069 */
module.exports = Session

var debug = require('debug')('snapchat:session')
var User = require('./user')

/**
 * Snapchat Session
 *
 * @param {Object} params
 */
function Session (params) {
  var self = this
  if (!(self instanceof Session)) return new Session(params)

  var storiesResponse = params["stories_response"]
  var friendsResponse = params["friends_response"]
  var updatesResponse = params["updates_response"]
  var identity = params["identity_check_response"]
  var features = updatesResponse["feature_settings"]
  var discover = params["discover"]
  var messagingGate = params["messaging_gateway_info"]

  var friendStories = storiesResponse["friend_stories"]
  var myStories = storiesResponse["my_stories"]
  //var groupStories = storiesResponse["my_group_stories"]

  var friends = friendsResponse["friends"]
  var added = friendsResponse["added_friends"]
  var conversations = params["conversations_response"]

  self.backgroundFetchSecret = params["background_fetch_secret_key"]
  self.bestFriendUsernames = friendsResponse["bests"]

  self.storiesDelta = !!storiesResponse["friend_stories_delta"]
  self.emailVerified = !!identity["is_email_verified"]
  self.highAccuracyRequiredForNearby = !!identity["is_high_accuracy_required_for_nearby"]
  self.requirePhonePasswordConfirmed = !!identity["require_phone_password_confirmed"]
  self.redGearDurationMilliseconds = +identity["red_gear_duration_millis"]
  self.suggestedFriendFetchThresholdHours = identity["suggested_friend_fetch_threshold_hours"]|0

  self.messagingGatewayAuth = messagingGate["gateway_auth_token"]
  self.messagingGatewayServer = messagingGate["gateway_server"]

  // Discover
  self.discoverSupported = (discover["compatibility"] === "supported")
  self.discoverSharingEnabled = !!discover["sharing_enabled"]
  self.discoverGetChannels = discover["get_channels"]
  self.discoverResourceParamName = discover["resource_parameter_name"]
  self.discoverResourceParamValue = discover["resource_parameter_value"]
  self.discoverVideoCatalog = discover["video_catalog"]

  // Friends
  self.friends = (friends || []).map(function (friend) {
    return new User(friend)
  })

  // Added friends
  self.addedFriends = (addedFriends || []).map(function (friend) {
    return new User(friend)
  })

  // Conversations
  temp = [NSMutableOrderedSet orderedSet]
  for (NSDictionary *convo in conversations)
      [temp addObject:[[SKConversation alloc] initWithDictionary:convo]]
  self.conversations = temp

  // Story collections
  temp = [NSMutableOrderedSet orderedSet]
  for (NSDictionary *collection in friendStories)
      [temp addObject:[[SKStoryCollection alloc] initWithDictionary:collection]]
  self.stories = temp

  // User stories
  temp = [NSMutableOrderedSet orderedSet]
  for (NSDictionary *story in myStories)
      [temp addObject:[[SKUserStory alloc] initWithDictionary:story]]
  self.userStories = temp

  // Group stories?
  self.groupStories = [NSMutableOrderedSet new]

  // Added me but not added back

  temp = [NSMutableOrderedSet orderedSet]
  for (SKSimpleUser *user in self.addedFriends)
      if (![self.friends containsObject:user])
          [temp addObject:user]
  // Reverse so that most recent requests are at the front
  self.pendingRequests = temp


  // Cash info
  self.canUseCash = !!updatesResponse["allowed_to_use_cash"]
  self.isCashActive = !!updatesResponse["is_cash_active"]
  self.cashCustomerIdentifier = updatesResponse["cash_customer_id"]
  self.cashClientProperties = updatesResponse["client_properties"]
  self.cashProvider = updatesResponse["cash_provider"]

  // Basic user info
  self.username = updatesResponse["username"]
  self.email = updatesResponse["email"]
  self.mobileNumber = updatesResponse["mobile"]
  self.recieved = updatesResponse["recieved"]|0
  self.sent = updatesResponse["sent"]|0
  self.score = updatesResponse["score"]|0
  self.recents = updatesResponse["recents"]
  self.requests = updatesResponse["requests"]

  // Account information
  self.addedFriendsTimestamp = +NSDate dateWithTimeIntervalSince1970:[updatesResponse["added_friends_timestamp"]/1000]
  self.authToken = updatesResponse["auth_token"]
  self.canSeeMatureContent = !!updatesResponse["can_view_mature_content"]
  self.countryCode = updatesResponse["country_code"] ?: "US"
  self.lastTimestamp = +NSDate dateWithTimeIntervalSince1970:[updatesResponse["cash_provider"]/1000]
  self.devicetoken = updatesResponse["device_token"]
  self.canSaveStoryToGallery = !!updatesResponse["enable_save_story_to_gallery"]
  self.canVideoTranscodingAndroid = !!updatesResponse["enable_video_transcoding_android"]
  self.imageCaption = !!updatesResponse["image_caption"]
  self.requireRefreshingProfileMedia = !!updatesResponse["require_refreshing_profile_media"]
  self.isTwoFAEnabled = !!updatesResponse["is_two_fa_enabled"]
  self.lastAddressBookUpdateDate = +NSDate dateWithTimeIntervalSince1970:[updatesResponse["last_address_book_updated_date"]/1000]
  self.lastReplayedSnapDate = +NSDate dateWithTimeIntervalSince1970:[updatesResponse["last_replayed_snap_timestamp"]/1000]
  self.logged = !!updatesResponse["logged"]
  self.mobileVerificationKey = updatesResponse["mobile_verification_key"]
  self.canUploadRawThumbnail = !!updatesResponse["raw_thumbnail_upload_enabled"]
  self.seenTooltips = updatesResponse["seen_tooltips"]
  self.shouldCallToVerifyNumber = !!updatesResponse["should_call_to_verify_number"]
  self.shouldTextToVerifyNumber = !!updatesResponse["should_send_text_to_verify_number"]
  self.snapchatPhoneNumber = updatesResponse["snapchat_phone_number"]
  self.studySettings = updatesResponse["study_settings"]
  self.targeting = updatesResponse["targeting"]
  self.userIdentifier = updatesResponse["user_id"]
  self.videoFiltersEnabled = !!updatesResponse["video_filters_enabled"]
  self.QRPath = updatesResponse["qr_path"]

  // Preferences
  self.enableNotificationSounds = !!updatesResponse["notification_sound_setting"]
  self.numberOfBestFriends = updatesResponse["number_of_best_friends"]|0
  self.privacyEveryone = !updatesResponse["snap_p"]
  self.isSearchableByPhoneNumber = !!updatesResponse["searchable_by_phone_number"]
  self.storyPrivacy = SKStoryPrivacyFromString(updatesResponse["story_privacy"])

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
