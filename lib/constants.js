var Enum = require('enum')

/**
 * @namespace
 */
var constants = module.exports = {
  // ---------------------------------------------------------------------------
  // Enums
  // ---------------------------------------------------------------------------

  /** @enum **/
  SnapPrivacy: new Enum({
    'Everyone': 0,
    'Friends': 1
  }),

  /** @enum **/
  StoryPrivacy: new Enum({
    'Friends': 0,
    'Everyone': 1,
    'Custom': 2
  }),

  /** @enum **/
  AddSource: new Enum({
    'Phonebook': 1,
    'Username': 2,
    'AddedBack': 3
  }),

  /** @enum **/
  MediaKind: new Enum({
    'Image': 0,
    'Video': 1,
    'SilentVideo': 2,
    'FriendRequest': 3,
    'StrangerImage': 4,
    'StrangerVideo': 5,
    'StrangerSilentVideo': 6
  }),

  /** @enum **/
  MessageKind: new Enum({
    'Text': 0,
    'Media': 1,
    'DiscoverShared': 2
  }),

  /** @enum **/
  SnapStatus: new Enum({
    'None': -1,
    'Sent': 0,
    'Delivered': 1,
    'Opened': 2,
    'Screenshot': 3
  }),

  /** @enum **/
  FriendStatus: new Enum({
    'Confirmed': 0,
    'Unconfirmed': 1,
    'Blocked': 2,
    'Deleted': 3
  }),

  // ---------------------------------------------------------------------------
  // Static constants
  // ---------------------------------------------------------------------------

  screen: {
    width: 720,
    height: 1280,
    maxVideoWidth: 480,
    maxVideoHeight: 640
  },

  attestation: {
    // The user agent specific to making the attestation request.
    userAgent: 'SafetyNet/7329000 (klte KOT49H); gzip',

    // The sha256 digest of the certificate used to sign the Snapchat APK, base 64 encoded. It should never change.
    certificateDigest: 'Lxyq/KHtMNC044hj7vq+oOgVcR+kz3m4IlGaglnZWlg=',

    // Google Play Services version used to make the attestation request.
    GMSVersion: 7329038,

    // Authentication token sent to verify requests with the server to prevent abuse.
    auth: 'cp4craTcEr82Pdf5j8mwFKyb8FNZbcel',

    // Casper™ attestation request URL. Special thanks to Liam!
    URLCasper: 'https://api.casper.io/security/login/attestation',

    // Casper™ auth URL
    URLCasperAuth: 'https://api.casper.io/security/login/signrequest',

    // digest values for different versions of snapchat
    'digest9_8': 'vXCcGhQ7RfL1LUiE3F6vcNORNo7IFSOvuDBunK87mEI=',
    'digest9_9': 'Yk9Wqmx7TrTatldWI+5PWbQjGA8Gi8ZoO8X9OUAw1hg=',
    'digest9_10': 'JJShKOLH4YYjWZlJQ71A2dPTcmxbaMboyfo0nsKYayE=',
    'digest9_11': 'nNsTUhHYJ943NG6vAPNl+tRr1vktNb9HpvRxZuu/rrE=',
    'digest9_12_0_1': 'W4snbl56it9XbT2lsL4gyHwMsElnmOPBDp+iIYqbGcI=',
    'digest9_12_1': 'fGZExseKdFH1bltkKloaAGfGx0vnKDDymKiJAiLo3dU=',
    'digest9_12_2': 'LMQNajaQ4SO7vNaQS1FRokxCtQXeIHwKZiJYhMczDGk=',
    'digest9_12_3': 'bnVK+fT6BdldrY279ShOR9QZx0OIRJxGoPslBn70vng=',
    'digest9_13': 'BWDe2a5b3I26Yw6z4Prvh2aEMRcf2B1FMs8136QIeCM=',
    'digest9_14': 'k6IftsTIpJeVhZDoHZv9zxDhE7HuN50PpO3O/zIXxsU=',
    'digest9_14_1': 'pS+fbZ4Xw0ThusoWRo2eCldGmHohNYvau/VULlJbBnQ=',
    'digest9_14_2': '5O40Rllov9V8PpwD5zPmmp+GQi7UMIWz2A0LWZA7UX0=',

    // returns the digest for the current version of the snapchat client
    digest: function () {
      // var value = constants.attestation['digest9_14']
      var value = constants.attestation['digest9_14_2']
      if (!value) throw new Error('constants.attestation.digest invalid value')

      return value
    },

    // Authentication token sent to verify requests with the server to prevent abuse.
    'droidGuard': 'CgbMYHoVNWLYAQE4YRoMCMKa2IIDEKC349kCqgERCLikhu8CEKL-jf34_____wHoAfLYvrb7_____wHoAbjLt877_____wE4azhLEokMuKToh_JDOAH8CvNUrmmbUkT045BmT6P_KNQSwOPtKxfJzK43U0I8A3x9lhvIbj5rbW3EREoNXLsI4okM7eonVUPt_PNYSK-b3U-T_bCfQkhKZ6hQ2ByXyi81LMp9IbzCho9KzRi_3zn9ffewSW2UjaGj71_gm4iapZXcQCigaWJ28VW10g8aeVcXVnXMg7UfDfx7NXghb0ZtlNXu8QxSCTWzUrW5nQH_TcYVKKhO4uFkX_sPr9MVwchg5oUSfvAZ2X2ZnsrkszrUr_NtlLS3w56DnPJvcOnN7X0N70p5Hj8Uqlx-a39c6BO4zfd_TAsqiV02zLoVctaht332OHA8Ejh1tIs89d0xKryMBq3OUSKKfLuMcfohU9gLuYF5_yfh3LGt2A4KSlUF1_DKcgxhiBV-QlNJWOL45fXjPl1_h7KcxfegJy19tpZ8cZ_KAWd4W00NJb5AmSGnzIB0iAkh0iC6fwpxngWS9ew_1gQC68wHrxZ8oBsLjZyzWk1eV69Xt3FSsTRzhpaIgnveaEtRZt6KsZUy2sCgzU1BvBF-Cm9kW1taPLvhURVxljUABxyKSsEmCFkyJbKDqz6bnTmAEXoJVJ3OW0OW9bpLX7IsKSlnIKOAnET0aH0e7CLkpj2nke8h8nv5PoW-s60Cc_5SirP4hTZRJDvXJecYljQcTTX6MOKx-gRiLdvc0NWzow8yrGTuCqQ0rYBEUELh8U7dGYQk6WX92aJEWa6uZb3AN9WFGg0GxiY1Bpq9kO58mHSBqeJXCrQ4mq2GJJxhxUE13zzbqsWyPi66MbTH1-YRTrjVPj5nkZqomuCtWIyWnC573IyG37lt8eYLXLNTbwuVDmUfaXytgntNExITdf9iiN2zFEYAlKSEROMc3FEKwApy9zzeTC9ItHsXGm63vv9s_2zaKEk4kUP3ozNfIMYeImk2piUs5OhEzpdAx_xyHbQICac2IA5arJ0_kqZ42tcuIjnzw8IJuU4xTDfEK12Ju7HaK8KA2i8v5Wtv28EQdqUUXByM39t_u16yI2y_Me545HGO18r-GCH3XJPe1GqwMq_J8vJSx3ecZhEXWBOZsyW5OvZ4YjHULRBDphZpyOmVsW7pLUprr42cU1BtitQy0aJm-qzd1ud4FspjRf-bsuRvWruqdqPTG80NbB-WUPCDNTSZ49bwQ9_CW0VQbqzDRupyG-xl16DwCWvqeWVd-v2DYTKCESsKfJhUHmYyK_GbTgsEioZIKmgN6UERMYLxKRRibkT8r0vWpsqx53xB_MenVzfOmpsOCJt5ITalsMVINUnuYekYw1YG9b6HRLtR4dSZj36j6gMDwGpOEPtHeEt6Fjym0SjMNA6kL2qp8rqxSiKrc37RE7Y6f6d2RlarGZG5woPl59F4onBR3Z1SR5mc9Srzrsezn6petEl19w0GtPocw5mrbYphgmjqGKNKqgLCKQ5yhfA1FQMkaZQQSJRd_zg5DuKUr7Bi_fc0ag-iJ1YqCrSiR-AmZV2DUGcNuYe9BOKt70GpfYfyc2DIcSA6oNNnRyi5uqjA7FUvggsWh80s-1yHSl4klFmQN0X10X-FszbmP2PYOlipbG6lNe2qCdlT49XgO17625Spfu7ehpeP-wRjWxgG5A-l7HabM3BrJRvYiW4YXWmloH2C8qOiqnHtC_mDjWAChSK9unVfMLQOeHiBInGR3s44wZvgtVzn_uSHuIacbqCr8VW-efmRVJ5m3iNado9smCCn74xnkMFR4_nRTCz-uwTsQp6Vvk7A6B-avGIkSBWK26nn7p0wB-btIYVZhbHlvs7eRL4PF5sc7gDgS6fpTVOVTCUEUYDfOeyu2TD-JUv0tnNxyH8zdeMHYjtQKgHDNMoWHlA1ly_1BqbU2urn3N07I4BuoBWhSfzcsRmOXtBtylCrVRhC9MEOR-I8QGgFByZfixG4XwGQnbCx-LyAtn6ngcii79W0pA8AoG_-a0s-3aIebEpcz2_qPXqxZ1qk4ByA10VjIBTC73vY1_ChkHg6bvmOsgYcrOFmD9nrbBCgapBGOx_yWsPLLwAD-cGj'
  },

  core: {
    // The API URL. iOS uses the /bq endpoint, Android clients use the /ph endpoint.
    baseURL: 'https://feelinsonice-hrd.appspot.com',

    // A set of possible API proxies
    baseList: [
      'https://feelinsonice-hrd.appspot.com',
      'https://app.snapchat.com'
    ],

    // Before updating this value, confirm that the library requests everything in the same way as the app.
    // Snapchat/9.10.0.0 (HTC One; Android 4.4.2#302626.7#19; gzip)'
    // userAgent: 'Snapchat/9.12.2.0 (SM-N9005; Android 5.0.2; gzip)',
    // userAgent: 'Snapchat/9.14.0.0 (SM-N9005; Android 5.0.2; gzip)',
    userAgent: 'Snapchat/9.14.2.0 (SM-N9005; Android 5.0.2; gzip)',

    // An alternate base URL for sending certain POST requests.
    eventsURL: 'https://sc-analytics.appspot.com/post_events',

    // The base URL for sending analytics.
    analyticsURL: 'https://sc-analytics.appspot.com/analytics/bz',

    // The API secret used to create access tokens.
    secret: 'iEk21fuwZApXlz93750dmW22pw389dPwOk',

    // Used when no session is available.
    staticToken: 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9',

    // Used to encrypt and decrypt media.
    blobEncryptionKey: 'M02cnQ51Ji97vwT4',

    // Used to create the token for each request.
    hashPattern: '0001110111101110001111010101111011010001001110011000110001000110',

    // Used to separate form fields when sending snaps.
    boundary: 'Boundary+0xAbCdEfGbOuNdArY',

    deviceToken1i: 'dtoken1i',
    deviceToken1v: 'dtoken1v',

    googleDefaultPublicKey: 'AAAAgMom/1a/v0lblO2Ubrt60J2gcuXSljGFQXgcyZWveWLEwo6prwgi3iJIZdodyhKZQrNWp5nKJ3srRXcUW+F1BD3baEVGcmEgqaLZUNBjm057pKRI16kB0YppeGx5qIQ5QjKzsR8ETQbKLNWgRY0QRNVz34kMJR3P/LgHax/6rmf5AAAAAwEAAQ=='
  },

  headers: {
    timestamp: 'X-Timestamp',
    userAgent: 'User-Agent',
    contentType: 'Content-Type',
    acceptLanguage: 'Accept-Language',
    acceptLocale: 'Accept-Locale',
    clientAuth: 'X-Snapchat-Client-Auth',
    clientAuthToken: 'X-Snapchat-Client-Auth-Token',
    values: {
      language: 'en',
      locale: 'en_US'
    }
  },

  featureSettings: {
    frontFacingFlash: 'front_facing_flash',
    replaySnaps: 'replay_snaps',
    smartFilters: 'smart_filters',
    visualFilters: 'visual_filters',
    powerSaveMode: 'power_save_mode',
    specialText: 'special_text',
    swipeCashMode: 'swipe_cash_mode',
    travelMode: 'travel_mode'
  },

  endpoints: {
    misc: {
      ping: '/loq/ping',
      locationData: '/loq/loc_data',
      serverList: '/loq/gae_server_list',
      doublePost: '/loq/double_post',
      reauth: '/bq/reauth',
      suggestFriend: '/bq/suggest_friend'
    },

    update: {
      all: '/loq/all_updates',
      snaps: '/bq/update_snaps',
      stories: '/bq/update_stories',
      user: '/loq/update_user', // just /update_stories?
      featureSettings: '/bq/update_feature_settings'
    },

    account: {
      login: '/loq/login',
      logout: '/ph/logout',
      twoFAPhoneVerify: '/loq/two_fa_phone_verify',
      twoFARecoveryCode: '/loq/two_fa_recovery_code',
      setBestsCount: '/bq/set_num_best_friends',
      settings: '/ph/settings',
      snaptag: '/bq/snaptag_download',
      registration: {
        start: '/loq/register',
        username: '/loq/register_username',
        getCaptcha: '/bq/get_captcha',
        solveCaptcha: '/bq/solve_captcha',
        verifyPhone: '/bq/phone_verify',
        suggestUsername: '/bq/suggest_username'
      },
      avatar: {
        set: '/bq/upload_profile_data',
        get: '/bq/delete_profile_data',
        remove: '/bq/delete_profile_data',
        getFriend: '/bq/download_friends_profile_data'
      }
    },

    chat: {
      sendMessage: '/loq/conversation_post_messages',
      conversation: '/loq/conversation',
      conversations: '/loq/conversations',
      authToken: '/loq/conversation_auth_token',
      clear: '/ph/clear',
      clearFeed: '/loq/clear_feed',
      clearConvo: '/loq/clear_conversation',
      typing: '/bq/chat_typing',
      media: '/bq/chat_media',
      uploadMedia: '/bq/upload_chat_media',
      shareMedia: '/loq/conversation_share_media'
    },

    device: {
      IPRouting: '/bq/ip_routing',
      IPRoutingError: '/bq/ip_routing_error',
      identifier: '/loq/device_id',
      device: '/ph/device'
    },

    discover: {
      channels: '/discover/channel_list?region=',
      icons: '/discover/icons?icon=',
      snaps: '/discover/dsnaps?edition_id=', // &snap_id= &hash= &publisher= &session.resourceParamName=session.resourceParamValue
      intros: '/discover/intro_videos?publisher=' // &intro_video= &session.resourceParamName=session.resourceParamValue
    },

    friends: {
      find: '/bq/find_friends',
      findNearby: '/bq/find_nearby_friends',
      bests: '/bq/bests',
      friend: '/bq/friend',
      hide: '/loq/friend_hide',
      search: '/loq/friend_search',
      exists: '/bq/user_exists'
    },

    snaps: {
      loadBlob: '/bq/blob', // /ph/blob ?
      upload: '/ph/upload',
      send: '/loq/retry',
      retry: '/loq/send'
    },

    stories: {
      stories: '/bq/stories',
      upload: '/ph/upload',
      blob: '/bq/story_blob?story_id=',
      thumb: '/bq/story_thumbnail?story_id=',
      authBlob: '/bq/auth_story_blob?story_id=',
      authThumb: '/bq/auth_story_thumbnail?story_id=',
      remove: '/bq/delete_story',
      post: '/bq/post_story',
      retryPost: '/bq/retry_post_story'
    },

    cash: {
      checkRecipientEligibility: '/cash/check_recipient_eligible',
      generateAccessToken: '/cash/generate_access_token',
      generateSignature: '/cash/generate_signature_for_phone',
      markViewed: '/cash/mark_as_viewed',
      resetAccount: '/cash/reset_account',
      transaction: '/cash/transaction',
      updateTransaction: '/cash/update_transaction',
      validateTransaction: '/cash/validate_transaction'
    },

    android: {
      findNearbyFriends: '/bq/and/find_nearby_friends',
      changeEmail: '/loq/and/change_email',
      changePass: '/loq/and/change_password',
      getPassStrength: '/loq/and/get_password_strength',
      registerExp: '/loq/and/register_exp'
    },

    sharedDescription: '/shared/description'
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

  messageKindFromString: function (messageKind) {
    messageKind = (messageKind || '').toLowerCase()

    if (messageKind === constants.MessageKind.Text.key.toLowerCase()) {
      return constants.MessageKind.Text.value
    } else if (messageKind === constants.MessageKind.Media.key.toLowerCase()) {
      return constants.MessageKind.Media.value
    } else if (messageKind === constants.MessageKind.DiscoverShared.key.toLowerCase()) {
      return constants.MessageKind.DiscoverShared.value
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
