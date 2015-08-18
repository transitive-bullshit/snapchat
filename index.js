module.exports = Snapchat

// external
var debug = require('debug')('snapchat')
var request = require('request')
var phone = require('phone')
var zlib = require('zlib')

// utilities
var constants = require('./lib/constants')
var Request = require('./lib/request')
var BufferUtils = require('./lib/buffer-utils')
var StringUtils = require('./lib/string-utils')

// routes
var Account = require('./routes/account')
var Chat = require('./routes/chat')
var Device = require('./routes/device')
var Friends = require('./routes/friends')
var Snaps = require('./routes/snaps')
var Stories = require('./routes/stories')

// models
var Session = require('./models/session')

/**
 * Snapchat Client
 *
 * @param {Object} opts (currently unused)
 */
function Snapchat (opts) {
  var self = this
  if (!(self instanceof Snapchat)) return new Snapchat(opts)
  if (!opts) opts = {}

  debug('new snapchat client')

  self.account = new Account(self, opts)
  self.chat = new Chat(self, opts)
  self.device = new Device(self, opts)
  self.friends = new Friends(self, opts)
  self.snaps = new Snaps(self, opts)
  self.stories = new Stories(self, opts)
}

/**
 * The username of the currently signed in (or not yet singed in) user.
 * @note Always lowercase.
 *
 * @type {string}
 */
Object.defineProperty(Snapchat.prototype, 'username', {
  get: function () {
    var self = this
    return self._username
  }
})

/**
 * The username of the currently signed in (or not yet singed in) user.
 * @note Always lowercase.
 *
 * @type {Session}
 */
Object.defineProperty(Snapchat.prototype, 'currentSession', {
  get: function () {
    var self = this
    return self._currentSession
  },

  set: function (currentSession) {
    var self = this
    self._currentSession = currentSession

    if (currentSession) {
      self._username = currentSession.username
      self._authToken = currentSession.authToken
    } else {
      self._username = null
      self._authToken = null
    }
  }
})

/**
 * The size of your device's screen.
 *
 * @type {Object}
 */
Object.defineProperty(Snapchat.prototype, 'screenSize', {
  get: function () {
    var self = this
    return self._screenSize
  }
})

/**
 * The maximum size to load videos in
 *
 * @type {Object}
 */
Object.defineProperty(Snapchat.prototype, 'maxVideoSize', {
  get: function () {
    var self = this
    return self._maxVideoSize
  }
})

/**
 * Whether or not this client is signed in.
 *
 * @type {boolean}
 */
Object.defineProperty(Snapchat.prototype, 'isSignedIn', {
  get: function () {
    var self = this
    return self._googleAuthToken && self._authToken && self._username
  }
})

/**
 * Used internally to sign in.
 *
 * @type {string}
 */
Object.defineProperty(Snapchat.prototype, 'authToken', {
  get: function () {
    var self = this
    return self._authToken
  }
})

/**
 * Used internally to sign in.
 *
 * @type {string}
 */
Object.defineProperty(Snapchat.prototype, 'googleAuthToken', {
  get: function () {
    var self = this
    return self._googleAuthToken
  }
})

/**
 * Used internally.
 *
 * @type {string}
 */
Object.defineProperty(Snapchat.prototype, 'deviceToken1i', {
  get: function () {
    var self = this
    return self._deviceToken1i
  }
})

/**
 * Used internally.
 *
 * @type {string}
 */
Object.defineProperty(Snapchat.prototype, 'deviceToken1v', {
  get: function () {
    var self = this
    return self._deviceToken1v
  }
})

/**
 * Used internally to sign in and trick Snapchat into thinking we're using the first party client.
 *
 * @type {string}
 */
Object.defineProperty(Snapchat.prototype, 'googleAttestation', {
  get: function () {
    var self = this
    return self._googleAttestation
  }
})

/**
 * Signs into Snapchat.
 *
 * A valid GMail account is necessary to trick Snapchat into thinking we're using the first party client.
 *
 * @param {string} username The Snapchat username to sign in with.
 * @param {string} password The password to the Snapchat account to sign in with.
 * @param {string} gmailEmail A vaild GMail address.
 * @param {string} gmailPassword The password associated with \c gmailEmail.
 * @param {function} cb
 */
Snapchat.prototype.signIn = function (username, password, gmailEmail, gmailPassword, cb) {
  var self = this
  debug('Snapchat.signIn (username %s)', username)

  self._getGoogleAuthToken(gmailEmail, gmailPassword, function (err, gauth) {
    if (err) {
      debug('could not retrieve google auth token')
      return cb(err)
    }

    var timestamp = StringUtils.timestamp()

    self._getAttestation(username, password, timestamp, function (err, attestation) {
      if (err) {
        debug('could not retrieve attestation')
        return cb(err)
      }

      self._getGoogleCloudMessagingIdentifier(function (err, ptoken) {
        if (err) {
          debug('could not google cloud messaging identifier')
          return cb(err)
        }

        self._getDeviceTokens(function (err, deviceTokens) {
          if (err) {
            debug('error getting device token')
            return cb(err)
          }

          self._googleAuthToken = gauth
          self._googleAttestation = attestation
          self._deviceToken1i = deviceTokens[constants.core.deviceToken1i]
          self._deviceToken1v = deviceTokens[constants.core.deviceToken1v]

          var reqToken = StringUtils.hashSCString(constants.core.staticToken, timestamp)
          var preHash = StringUtils.getSCPreHashString(username, password, timestamp, reqToken)
          var deviceHash = StringUtils.hashHMacToBase64(preHash, self._deviceToken1i).substr(0, 20)

          var params = {
            'username': username,
            'password': password,
            'width': constants.screen.width,
            'height': constants.screen.height,
            'max_video_width': constants.screen.maxVideoWidth,
            'max_video_height': constants.screen.maxVideoHeight,
            'application_id': 'com.snapchat.android',
            'is_two_fa': 'false',
            'ptoken': ptoken,
            'pre_auth': '',
            'sflag': 1,
            'dsig': deviceHash,
            'dtoken1i': self._deviceToken1i,
            'attestation': self._googleAttestation,
            'timestamp': timestamp
          }

          Request.post(constants.endpoints.account.login, params, self._googleAuthToken, null, function (err, result) {
            if (err) {
              debug('Snapchat.signIn error %s', err)
              return cb(err)
            } else if (result) {
              self.currentSession = new Session(result)
              return cb(null, self.currentSession)
            }

            cb('signIn parse error')
          })
        })
      })
    })
  })
}

/**
 * Use this to restore a session that ended within the last hour. The google auth token must be re-generated every hour.
 *
 * @param {string} username Your Snapchat username.
 * @param {string} authToken Your Snapchat auth token. Can be retrieved from the \c authToken property.
 * @param {string} googleAuthToken Your Google auth token. Can be retrieved from the \c googleAuthToken property.
 * @param {function} cb
 */
Snapchat.prototype.restoreSession = function (username, authToken, googleAuthToken, cb) {
  var self = this
  debug('Snapchat.restoreSession (username %s)', username)

  self._username = username
  self._authToken = authToken
  self._googleAuthToken = googleAuthToken

  self.updateSession(cb)
}

/**
 * Signs out.
 *
 * @param {function} cb
 */
Snapchat.prototype.signOut = function (cb) {
  var self = this
  debug('Snapchat.signOut (%s)', self.username)

  if (!self.isSignedIn) {
    return cb(new Error('signin required'))
  }

  self.post(constants.endpoints.account.logout, {
    'username': self._username
  }, function (err, result) {
    if (err) {
      debug('Snapchat.signOut error %s', err)
      return cb(err)
    } else if (result && result.length === 0) {
      self._currentSession = null
      self._username = null
      self._authToken = null
      self._googleAuthToken = null
      self._googleAttestation = null
      self._deviceToken1i = null
      self._deviceToken1v = null
      return cb(null)
    }

    cb('Snapchat.signOut parse error')
  })
}

/**
 * Updates all information in the \c currentSession property.
 *
 * @param {function} cb
 */
Snapchat.prototype.updateSession = function (cb) {
  var self = this
  debug('Snapchat.updateSession')

  if (!self.isSignedIn) {
    return cb(new Error('signin required'))
  }

  self.post(constants.endpoints.update.all, {
    'username': self._username,
    'width': constants.screen.width,
    'height': constants.screen.height,
    'max_video_width': constants.screen.maxVideoWidth,
    'max_video_height': constants.screen.maxVideoHeight,
    'include_client_settings': 'true'
  }, function (err, result) {
    if (err) {
      debug('updateSession error %s', err)
      return cb(err)
    } else if (result) {
      self.currentSession = new Session(result)
      return cb(null, self.currentSession)
    }

    cb('updateSession error')
  })
}

/**
 * The first step in creating a new Snapchat account.
 * Registers an email, password, and birthday in preparation for creating a new account.
 *
 * The result passed to cb has the following keys:
 *  - \c email: the email you registered with.
 *  - \c snapchat_phone_number: a number you can use to verify your phone number later.
 *  - \c username_suggestions: an array of available usernames for the next step.
 *
 * @param {string} email The email address to be associated with the account.
 * @param {string} password The password of the account to be created.
 * @param {string} birthday Your birthday, in the format YYYY-MM-DD.
 * @param {function} cb
 */
Snapchat.prototype.registerEmail = function (email, password, birthday, cb) {
  var self = this
  debug('Snapchat.registerEmail (email %s)', email)

  self.post(constants.endpoints.account.registration.start, {
    'email': email,
    'password': password,
    'birthday': birthday
  }, function (err, result) {
    if (err) {
      debug('registerEmail error %s', err)
      return cb(err)
    } else if (result && !!result.logged) {
      return cb(null, result)
    }

    cb('registerEmail parse error')
  })
}

/**
 * The second step in creating a new Snapchat account.
 * Registers a username with an email that was registered in the first step.
 * You must call this method after successfully completing the first step in registration.
 *
 * @param {string} username The username of the account to be created, trimmed to the first 15 characters.
 * @param {string} registeredEmail The previously registered email address associated with the account (from the first step of registration).
 * @param {string} gmailEmail A valid GMail address. Required to make Snapchat think this is an official client.
 * @param {string} gmailPassword The password to the Google account associated with gmailEmail.
 * @param {function} cb
 */
Snapchat.prototype.registerUsername = function (username, registeredEmail, gmailEmail, gmailPassword, cb) {
  var self = this
  debug('Snapchat.registerUsername (username %s, email %s)', username, registeredEmail)

  self._getGoogleAuthToken(gmailEmail, gmailPassword, function (err, gauth) {
    if (err) {
      debug('could not retrieve google auth token')
      return cb(err)
    }

    self.post(constants.endpoints.account.registration.username, {
      'username': registeredEmail,
      'selected_username': username
    }, function (err, result) {
      if (err) {
        debug('registerUsername error %s', err)
        return cb(err)
      } else if (result) {
        self.currentSession = new Session(result)
        self._googleAuthToken = gauth
        return cb(null)
      }

      cb('registerUsername parse error')
    })
  })
}

/**
 * The third and final step in registration.
 * If you don't want to verify your humanity a phone number,
 * you can verify it by with a 'captcha' image of sorts.
 *
 * @param {string} mobile A 10-digit (+ optional country code, defaults to 1) mobile phone number to be associated with the account, in any format. i.e. +11234567890, (123) 456-7890, 1-1234567890
 * @param {boolean} sms YES if you want a code sent via SMS, NO if you want to be called for verification.
 * @param {function} cb
 */
Snapchat.prototype.sendPhoneVerification = function (mobile, sms, cb) {
  var self = this
  debug('Snapchat.sendPhoneVerification (mobile %s, sms %d)', mobile, sms)

  if (!self.isSignedIn) {
    return cb(new Error('signin required'))
  }

  mobile = phone(mobile)
  var countryCode = +mobile[1]
  mobile = mobile.substr(2)

  self.post(constants.endpoints.account.registration.verifyPhone, {
    'username': self._username,
    'phoneNumber': mobile,
    'countryCode': countryCode,
    'action': 'updatePhoneNumber',
    'skipConfirmation': true
  }, function (err, result) {
    if (err) {
      debug('sendPhoneVerification error %s', err)
      return cb(err)
    } else {
      debug('sendPhoneVerification result %j', result)
      return cb(null, result)
    }
  })
}

/**
 * Verifies your phone number, completing registration.
 *
 * @warning cb is not called in this implementaiton because I haven't tested it yet.
 * @todo: document response, get cb working
 * @param {string} code The code sent to verify your number.
 * @param {function} cb
*/
Snapchat.prototype.verifyPhoneNumber = function (code, cb) {
  var self = this
  debug('Snapchat.verifyPhoneNumber (code %s)', code)

  if (!self.isSignedIn) {
    return cb(new Error('signin required'))
  }

  Request.post(constants.endpoints.account.registration.verifyPhone, {
    'action': 'verifyPhoneNumber',
    'username': self._username,
    'code': code
  }, self._googleAuthToken, constants.core.staticToken, function (err, result) {
    if (err) {
      debug('verifyPhoneNumber error %s', err)
      return cb(err)
    }

    debug('verifyPhoneNumber result %j', result)
    cb(null, result)
  })
}

/**
 * Downloads captcha images to verify a new account with.
 * cb will be called with an array of 9 Blobs representing captcha images.
 *
 * @param {function} cb
 */
Snapchat.prototype.getCaptcha = function (cb) {
  var self = this
  debug('Snapchat.getCaptcha')

  if (!self.isSignedIn) {
    return cb(new Error('signin required'))
  }

  self.post(constants.endpoints.account.registration.getCaptcha, {
    'username': self._username
  }, function (err, body) {
    if (err) {
      debug('getCaptcha error %s', err)
      return cb(err)
    } else {

      zlib.gunzip(new Buffer(body), function (err, data) {
        if (err) {
          debug('getCaptcha gunzip error %s', err)
          return cb(err)
        }

        // TODO
        cb(new Error('Snapchat.getCaptcha TODO'))
      })
    }
  })
}

/**
 * Use this to 'solve' a captcha.
 * @warning Seems to not be working.
 * @todo: document response
 *
 * @param {string} solution The solution to the captcha as a binary string. If the first, second, and last images contain ghosts, the solution would be \c '110000001'.
 * @param {function} cb
 */
Snapchat.prototype.solveCaptcha = function (solution, cb) {
  var self = this
  debug('Snapchat.solveCaptcha')

  if (!self.isSignedIn) {
    return cb(new Error('signin required'))
  }

  throw new Error('Snapchat.solveCaptcha TODO')
}

/**
 * Initializes a POST request to the Snapchat API.
 *
 * @param {string} endpoint Snapchat API endpoint
 * @param {Object} params Form data (will be augmented with required snapchat API params)
 * @param {function} cb
 */
Snapchat.prototype.post = function (endpoint, params, cb) {
  var self = this
  debug('Snapchat.post (%s)', endpoint)

  Request.post(endpoint, params, self._googleAuthToken, self._authToken, cb)
}

/**
 * internal
 */
Snapchat.prototype.sendEvents = function (events, snapInfo, cb) {
  var self = this
  debug('Snapchat.sendEvents')

  if (!self.isSignedIn) {
    return cb(new Error('signin required'))
  }

  cb = cb || function () { }
  events = events || { }
  snapInfo = snapInfo || { }

  self._post(constants.endpoints.update.snaps, {
    'events': JSON.stringify(events),
    'json': JSON.stringify(snapInfo),
    'username': self._username
  }, function (err, result) {
    if (err) {
      debug('sendEvents error %s', err)
      return cb(err)
    } else {
      debug('sendEvents result %j', result)
      cb(null, result)
    }
  })
}

/**
 * internal
 */
Snapchat.prototype._getGoogleAuthToken = function (gmailEmail, gmailPassword, cb) {
  var params = {
    'google_play_services_version': '7097038',
    'device_country': 'us',
    'operatorCountry': 'us',
    'lang': 'en_US',
    'sdk_version': '19',
    'accountType': 'HOSTED_OR_GOOGLE',
    'Email': gmailEmail,
    'Passwd': gmailPassword,
    //'EncryptedPasswd': encryptedGmailPassword, // TODO
    'service': 'audience:server:client_id:694893979329-l59f3phl42et9clpoo296d8raqoljl6p.apps.googleusercontent.com',
    'source': 'android',
    'androidId': '378c184c6070c26c',
    'app': 'com.snapchat.android',
    'client_sig': '49f6badb81d89a9e38d65de76f09355071bd67e7',
    'callerPkg': 'com.snapchat.android',
    'callerSig': '49f6badb81d89a9e38d65de76f09355071bd67e7'
  }

  var headers = {
    'device': '378c184c6070c26c',
    'app': 'com.snapchat.android',
    'Accept-Encoding': 'gzip'
  }

  headers[constants.headers.userAgent] = 'GoogleAuth/1.4 (mako JDQ39)'

  request.post({
    url: 'https://android.clients.google.com/auth',
    form: params,
    headers: headers
  }, function (err, body) {
    if (err) {
      debug('_getGoogleAuthToken error %s', err)
      cb(err)
    } else {
      cb(null, StringUtils.matchGroup(body, /Auth=([\w\.-]+)/i, 1))
    }
  })
}

// static cache of device tokens
var sDeviceToken1i = null
var sDeviceToken1v = null

/**
 * internal
 */
Snapchat.prototype._getDeviceTokens = function (cb) {
  // cache device tokens
  var dt1i = sDeviceToken1i
  var dt1v = sDeviceToken1v

  function completion () {
    var result = { }
    result[constants.core.deviceToken1i] = dt1i
    result[constants.core.deviceToken1v] = dt1v

    cb(null, result)
  }

  if (dt1i && dt1v) {
    return completion()
  } else {
    Request.post(constants.endpoints.device.identifier, { }, null, null, function (err, result) {
      if (err) {
        debug('_getDeviceTokens error %s', err)
        return cb(err)
      } else if (result) {
        dt1i = result[constants.core.deviceToken1i]
        dt1v = result[constants.core.deviceToken1v]

        if (dt1i && dt1v) {
          sDeviceToken1i = dt1i
          sDeviceToken1v = dt1v

          return completion()
        }
      }

      debug('Snapchat._getDeviceTokens parse error %j', result)
      cb('Snapchat._getDeviceTokens parse error')
    })
  }
}

/**
 * ptoken value
 * internal
 */
Snapchat.prototype._getGoogleCloudMessagingIdentifier = function (cb) {
  var params = {
    'X-google.message_id': 'google.rpc1',
    'device': 4343470343591528399,
    'sender': 191410808405,
    'app_ver': 706,
    'gcm_ver': 7097038,
    'app': 'com.snapchat.android',
    'iat': (new Date()).getTime(),
    'cert': '49f6badb81d89a9e38d65de76f09355071bd67e7'
  }

  var headers = {
    'Accept-Language': 'en',
    'Accept-Locale': 'en_US',
    'app': 'com.snapchat.android',
    'Authorization': 'AidLogin 4343470343591528399: 5885638743641649694',
    'Gcm-ver': '7097038',
    'Accept-Encoding': 'gzip'
  }

  headers[constants.headers.userAgent] = 'Android-GCM/1.5 (A116 _Quad KOT49H)'

  request.post({
    url: 'https://android.clients.google.com/c2dm/register3',
    form: params,
    headers: headers
  }, function (err, body) {
    if (err) {
      return cb(err)
    } else {
      // parse token
      var token = StringUtils.matchGroup(body, /token=([\w\.-]+)/, 1)

      if (token) {
        return cb(null, token)
      } else {
        debug('_getGoogleCloudMessagingIdentifier using default token %s', body)

        // default token
        return cb(null, 'ie')
      }
    }

    debug('_getGoogleCloudMessagingIdentifier parse error %s', body)
    cb('_getGoogleCloudMessagingIdentifier error')
  })
}

/**
 * Attestation, courtesy of \c casper.io
 * internal
 */
Snapchat.prototype._getAttestation = function (username, password, ts, cb) {
  var preHash = StringUtils.getSCPreHashString(username, password, ts, constants.endpoints.account.login)
  var nonce = new Buffer(BufferUtils.sha256HashToBase64(preHash))

  var params = {
    'nonce': nonce,
    'authentication': constants.attestation.auth,
    'apk_digest': constants.attestation['digest9_12_2'],
    'timestamp': ts
  }

  request.post({
    url: constants.attestation.URLCaspter,
    form: params
  }, function (err, result) {
    if (err) {
      return cb(err)
    } else if (result && +result.code === 200) {
      return cb(null, result.signedAttestation)
    }

    return cb('Snapchat._getAttestation unknown error')
  })
}
