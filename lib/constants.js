var Enum = require('enum')

var constants = module.exports = {
  // ---------------------------------------------------------------------------
  // Enums
  // ---------------------------------------------------------------------------

  SnapPrivacy: new Enum([
    'Everyone',
    'Friends'
  ]),

  StoryPrivacy: new Enum([
    'Friends',
    'Everyone',
    'Custom'
  ]),

  AddSource: new Enum({
    'Phonebook': 1,
    'Username': 2,
    'AddedBack': 3
  }),

  MediaKind: new Enum([
    'Image',
    'Video',
    'SilentVideo',
    'FriendRequest',
    'StrangerImage',
    'StrangerVideo',
    'StrangerSilentVideo'
  ]),

  SnapStatus: new Enum({
    'None': -1,
    'Sent': 0,
    'Delivered': 1,
    'Opened': 2,
    'Screenshot': 3
  }),

  FriendStatus: new Enum([
    'Confirmed',
    'Unconfirmed',
    'Blocked',
    'Deleted'
  ]),

  // ---------------------------------------------------------------------------
  // Static constants
  // ---------------------------------------------------------------------------

  attestation: {
    // The user agent specific to making the attestation request.
    userAgent: "SafetyNet/7329000 (klte KOT49H); gzip",

    // The sha256 digest of the certificate used to sign the Snapchat APK, base 64 encoded. It should never change.
    certificateDigest: "Lxyq/KHtMNC044hj7vq+oOgVcR+kz3m4IlGaglnZWlg=",

    // Google Play Services version used to make the attestation request.
    GMSVersion: "7329038",

    // Authentication token sent to verify requests with the server to prevent abuse.
    auth: "cp4craTcEr82Pdf5j8mwFKyb8FNZbcel",

    // Casper™ attestation request URL. Special thanks to Liam!
    URLCasper: "http://attest.casper.io/attestation",

    // SnapKeep™ attestation request URL. Special thanks to Harry!
    URLSnapKeep: "[redacted]",

    digest9_8: "vXCcGhQ7RfL1LUiE3F6vcNORNo7IFSOvuDBunK87mEI=",
    digest9_9: "Yk9Wqmx7TrTatldWI+5PWbQjGA8Gi8ZoO8X9OUAw1hg=",
    digest9_10: "JJShKOLH4YYjWZlJQ71A2dPTcmxbaMboyfo0nsKYayE=",
    digest9_11: "nNsTUhHYJ943NG6vAPNl+tRr1vktNb9HpvRxZuu/rrE=",
    digest9_12_0_1: "W4snbl56it9XbT2lsL4gyHwMsElnmOPBDp+iIYqbGcI=",
    digest9_12_1: "fGZExseKdFH1bltkKloaAGfGx0vnKDDymKiJAiLo3dU=",
    digest9_12_2: "LMQNajaQ4SO7vNaQS1FRokxCtQXeIHwKZiJYhMczDGk=",
    digest9_13_1_b: "VMQYnGA3YgMF2dJsy4WPPtMw0zu2EZZ9Yl6k3p5N7Ps="
  },

  core: {
    // The API URL. iOS uses the /bq endpoint, Android clients use the /ph endpoint.
    baseURL: "https://feelinsonice-hrd.appspot.com",

    // Before updating this value, confirm that the library requests everything in the same way as the app.
    // Snapchat/9.10.0.0 (HTC One; Android 4.4.2#302626.7#19; gzip)"
    userAgent: "Snapchat/9.12.2.0 (SM-N9005; Android 5.0.2; gzip)",

    // An alternate base URL for sending certain POST requests.
    eventsURL: "https://sc-analytics.appspot.com/post_events",

    // The base URL for sending analytics.
    analyticsURL: "https://sc-analytics.appspot.com/analytics/bz",

    // The API secret used to create access tokens.
    secret: "iEk21fuwZApXlz93750dmW22pw389dPwOk",

    // Used when no session is available.
    staticToken: "m198sOkJEn37DjqZ32lpRu76xmw288xSQ9",

    // Used to encrypt and decrypt media.
    blobEncryptionKey: "M02cnQ51Ji97vwT4",

    // Used to create the token for each request.
    hashPattern: "0001110111101110001111010101111011010001001110011000110001000110",

    // Used to separate form fields when sending snaps.
    boundary: "Boundary+0xAbCdEfGbOuNdArY",
    deviceToken1i: "dtoken1i",
    deviceToken1v: "dtoken1v"
  },

  headers: {
    timestamp: "X-Timestamp",
    userAgent: "User-Agent",
    contentType: "Content-Type",
    acceptLanguage: "Accept-Language",
    acceptLocale: "Accept-Locale",
    clientAuth: "X-Snapchat-Client-Auth",
    clientAuthToken: "X-Snapchat-Client-Auth-Token",
    values: {
      language: "en",
      locale: "en_US"
    }
  },

  featureSettings: {
    frontFacingFlash: "front_facing_flash",
    replaySnaps: "replay_snaps",
    smartFilters: "smart_filters",
    visualFilters: "visual_filters",
    powerSaveMode: "power_save_mode",
    specialText: "special_text",
    swipeCashMode: "swipe_cash_mode",
    travelMode: "travel_mode"
  },

  endpoints: {
    misc: {
      ping: "/loq/ping",
      locationData: "/loq/loc_data",
      serverList: "/loq/gae_server_list",
      doublePost: "/loq/double_post",
      reauth: "/bq/reauth",
      suggestFriend: "/bq/suggest_friend"
    },

    update: {
      all: "/loq/all_updates",
      snaps: "/bq/update_snaps",
      stories: "/bq/update_stories",
      user: "/loq/update_user", // just /update_stories?
      featureSettings: "/bq/update_feature_settings"
    },

    account: {
      login: "/loq/login",
      logout: "/ph/logout",
      twoFAPhoneVerify: "/loq/two_fa_phone_verify",
      twoFARecoveryCode: "/loq/two_fa_recovery_code",
      setBestsCount: "/bq/set_num_best_friends",
      settings: "/ph/settings",
      snaptag: "/bq/snaptag_download",
      registration: {
        start: "/loq/register",
        username: "/loq/register_username",
        getCaptcha: "/bq/get_captcha",
        solveCaptcha: "/bq/solve_captcha",
        verifyPhone: "/bq/phone_verify",
        suggestUsername: "/bq/suggest_username"
      },
      avatar: {
        set: "/bq/upload_profile_data",
        get: "/bq/delete_profile_data",
        remove: "/bq/delete_profile_data",
        getFriend: "/bq/download_friends_profile_data"
      }
    },

    chat: {
      sendMessage: "/loq/conversation_post_messages",
      conversation: "/loq/conversation",
      conversations: "/loq/conversations",
      authToken: "/loq/conversation_auth_token",
      clear: "/ph/clear",
      clearFeed: "/loq/clear_feed",
      clearConvo: "/loq/clear_conversation",
      typing: "/bq/chat_typing",
      media: "/bq/chat_media",
      uploadMedia: "/bq/upload_chat_media",
      shareMedia: "/loq/conversation_share_media"
    },

    device: {
      IPRouting: "/bq/ip_routing",
      IPRoutingError: "/bq/ip_routing_error",
      identifier: "/loq/device_id",
      device: "/ph/device"
    },

    discover: {
      channels: "/discover/channel_list?region=",
      icons: "/discover/icons?icon=",
      snaps: "/discover/dsnaps?edition_id=", // &snap_id= &hash= &publisher= &currentSession.resourceParamName=currentSession.resourceParamValue
      intros: "/discover/intro_videos?publisher=" // &intro_video= &currentSession.resourceParamName=currentSession.resourceParamValue
    },

    friends: {
      find: "/ph/find_friends",
      findNearby: "/bq/find_nearby_friends",
      bests: "/bq/bests",
      friend: "/bq/friend",
      hide: "/loq/friend_hide",
      search: "/loq/friend_search",
      exists: "/bq/user_exists"
    },

    snaps: {
      loadBlob: "/bq/blob", // /ph/blob ?
      upload: "/ph/upload",
      send: "/loq/retry",
      retry: "/loq/send"
    },

    stories: {
      stories: "/bq/stories",
      upload: "/ph/upload",
      blob: "/bq/story_blob?story_id=",
      thumb: "/bq/story_thumbnail?story_id=",
      authBlob: "/bq/auth_story_blob?story_id=",
      authThumb: "/bq/auth_story_thumbnail?story_id=",
      remove: "/bq/delete_story",
      post: "/bq/post_story",
      retryPost: "/bq/retry_post_story"
    },

    cash: {
      checkRecipientEligibility: "/cash/check_recipient_eligible",
      generateAccessToken: "/cash/generate_access_token",
      generateSignature: "/cash/generate_signature_for_phone",
      markViewed: "/cash/mark_as_viewed",
      resetAccount: "/cash/reset_account",
      transaction: "/cash/transaction",
      updateTransaction: "/cash/update_transaction",
      validateTransaction: "/cash/validate_transaction"
    },

    android: {
      findNearbyFriends: "/bq/and/find_nearby_friends",
      changeEmail: "/loq/and/change_email",
      changePass: "/loq/and/change_password",
      getPassStrength: "/loq/and/get_password_strength",
      registerExp: "/loq/and/register_exp"
    }
  },

  // ---------------------------------------------------------------------------
  // Dynamic Constants
  // ---------------------------------------------------------------------------

  addSourceFromString: function (addSource) {
    if (addSource === 'ADDED_BY_PHONE') {
      return constants.AddSource.Phonebook.value
    } else if (addSource === 'ADDED_BY_USERNAME') {
      return constants.AddSource.Username.value
    } else if (addSource === 'ADDED_BY_ADDED_ME_BACK') {
      return constants.AddSource.AddedBack.value
    }

    return 0
  },

  stringFromAddSource: function (addSource) {
    if (addSource === constants.AddSource.Phonebook.value) {
      return 'ADDED_BY_PHONE'
    } else if (addSource === constants.AddSource.Username.value) {
      return 'ADDED_BY_USERNAME'
    } else if (addSource === constants.AddSource.AddedBack.value) {
      return 'ADDED_BY_ADDED_ME_BACK'
    }

    return null
  },

  stringFromMediaKind: function (mediaKind) {
    return constants.MediaKind.get(mediaKind).key
  },

  stringFromStoryPrivacy: function (storyPrivacy) {
    if (storyPrivacy === constants.StoryPrivacy.Everyone.value) {
      return 'EVERYONE'
    } else if (storyPrivacy === constants.StoryPrivacy.Friends.value) {
      return 'FRIENDS'
    } else if (storyPrivacy === constants.StoryPrivacy.Custom.value) {
      return 'CUSTOM'
    }

    return null
  },

  mediaKindIsImage: function (mediaKind) {
    return mediaKind === constants.MediaKind.Image.value ||
           mediaKind === constants.MediaKind.StrangerImage.value
  },

  mediaKindIsVideo: function (mediaKind) {
    return mediaKind === constants.MediaKind.Video.value ||
           mediaKind === constants.MediaKind.SilentVideo.value ||
           mediaKind === constants.MediaKind.StrangerVideo.value ||
           mediaKind === constants.MediaKind.StrangerSilentVideo.value
  }
}
