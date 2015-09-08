module.exports = Snapchat

// external
var debug = require('debug')('snapchat')
var phone = require('phone')
var zlib = require('zlib')
var Promise = require('bluebird')
var Configstore = require('configstore')

// utilities
var constants = require('./lib/constants')
var Request = require('./lib/request')
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

var configs = new Configstore('snapchat')

/**
 * Snapchat Client
 *
 * @class
 * @param {Object} opts (currently unused)
 */
function Snapchat (opts) {
  var self = this
  if (!(self instanceof Snapchat)) return new Snapchat(opts)
  if (!opts) opts = {}

  debug('new snapchat client')

  self._account = new Account(self, opts)
  self._chat = new Chat(self, opts)
  self._device = new Device(self, opts)
  self._friends = new Friends(self, opts)
  self._snaps = new Snaps(self, opts)
  self._stories = new Stories(self, opts)
}

/**
 * Account routes.
 *
 * @name Snapchat#account
 * @property {Account}
 * @readonly
 */
Object.defineProperty(Snapchat.prototype, 'account', {
  get: function () { return this._account }
})

/**
 * Chat routes.
 *
 * @name Snapchat#chat
 * @property {Chat}
 * @readonly
 */
Object.defineProperty(Snapchat.prototype, 'chat', {
  get: function () { return this._chat }
})

/**
 * Device routes.
 *
 * @name Snapchat#device
 * @property {Device}
 * @readonly
 */
Object.defineProperty(Snapchat.prototype, 'device', {
  get: function () { return this._device }
})

/**
 * Friend routes.
 *
 * @name Snapchat#friends
 * @property {Friends}
 * @readonly
 */
Object.defineProperty(Snapchat.prototype, 'friends', {
  get: function () { return this._friends }
})

/**
 * Snap routes.
 *
 * @name Snapchat#snaps
 * @property {Snaps}
 * @readonly
 */
Object.defineProperty(Snapchat.prototype, 'snaps', {
  get: function () { return this._snaps }
})

/**
 * Story routes.
 *
 * @name Snapchat#stories
 * @property {Stories}
 * @readonly
 */
Object.defineProperty(Snapchat.prototype, 'stories', {
  get: function () { return this._stories }
})

/**
 * The username of the currently signed in (or not yet singed in) user.
 * (Always lowercase)
 *
 * @name Snapchat#username
 * @property {string}
 * @readonly
 */
Object.defineProperty(Snapchat.prototype, 'username', {
  get: function () { return this._username }
})

/**
 * The current session.
 *
 * @name Snapchat#session
 * @property {Session}
 */
Object.defineProperty(Snapchat.prototype, 'session', {
  get: function () { return this._session },

  set: function (session) {
    var self = this
    self._session = session

    if (session) {
      self._username = session.username
      self._authToken = session.authToken
    } else {
      self._username = null
      self._authToken = null
    }
  }
})

/**
 * The size of your device's screen.
 *
 * @name Snapchat#screenSize
 * @property {Object}
 */
Object.defineProperty(Snapchat.prototype, 'screenSize', {
  get: function () { return this._screenSize }
})

/**
 * The maximum size to load videos in.
 *
 * @name Snapchat#maxVideoSize
 * @property {Object}
 */
Object.defineProperty(Snapchat.prototype, 'maxVideoSize', {
  get: function () { return this._maxVideoSize }
})

/**
 * Whether or not this client is signed in.
 *
 * @name Snapchat#isSignedIn
 * @property {boolean}
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
 * @name Snapchat#authToken
 * @property {string}
 */
Object.defineProperty(Snapchat.prototype, 'authToken', {
  get: function () { return this._authToken }
})

/**
 * Used internally to sign in.
 *
 * @name Snapchat#googleAuthToken
 * @property {string}
 */
Object.defineProperty(Snapchat.prototype, 'googleAuthToken', {
  get: function () { return this._googleAuthToken }
})

/**
 * Used internally.
 *
 * @name Snapchat#deviceToken1i
 * @property {string}
 */
Object.defineProperty(Snapchat.prototype, 'deviceToken1i', {
  get: function () { return this._deviceToken1i }
})

/**
 * Used internally.
 *
 * @name Snapchat#deviceToken1v
 * @property {string}
 */
Object.defineProperty(Snapchat.prototype, 'deviceToken1v', {
  get: function () { return this._deviceToken1v }
})

/**
 * Used internally to sign in and trick Snapchat into thinking we're using the first party client.
 *
 * @name Snapchat#googleAttestation
 * @property {string}
 */
Object.defineProperty(Snapchat.prototype, 'googleAttestation', {
  get: function () { return this._googleAttestation }
})

/**
 * Signs into Snapchat.
 *
 * A valid GMail account is necessary to trick Snapchat into thinking we're using the first party client.
 *
 * Note that username, password, gmailEmail, and gmailPassword are all optional only if
 * their environment variable equivalents exist. E.g.,
 *
 * SNAPCHAT_USERNAME
 * SNAPCHAT_PASSWORD
 * SNAPCHAT_GMAIL_EMAIL
 * SNAPCHAT_GMAIL_PASSWORD
 *
 * @param {string} Optional username The Snapchat username to sign in with.
 * @param {string} Optional password The password to the Snapchat account to sign in with.
 * @param {string} Optional gmailEmail A valid GMail address.
 * @param {string} Optional gmailPassword The password associated with gmailEmail.
 * @param {function} cb
 */
Snapchat.prototype.signIn = function (username, password, gmailEmail, gmailPassword, cb) {
  var self = this

  if (typeof username === 'function') {
    cb = username
    username = process.env.SNAPCHAT_USERNAME
    password = process.env.SNAPCHAT_PASSWORD
    gmailEmail = process.env.SNAPCHAT_GMAIL_EMAIL
    gmailPassword = process.env.SNAPCHAT_GMAIL_PASSWORD
  }

  return new Promise(function (resolve, reject) {
    if (!(username && password && gmailEmail && gmailPassword)) {
      return reject(new Error('missing required login credentials'))
    }

    debug('Snapchat.signIn (username %s)', username)

    self._getGoogleAuthToken(gmailEmail, gmailPassword, function (err, googleAuthToken) {
      if (err) {
        debug('error getting google auth token')
        return reject(err)
      }

      var timestamp = StringUtils.timestamp()

      self._getAttestation(username, password, timestamp, function (err, attestation) {

        if (err) {
          debug('error getting attestation')
          return reject(err)
        }

        self._getGoogleCloudMessagingIdentifier(function (err, ptoken) {
          if (err) {
            debug('error getting google cloud messaging identifier')
            return reject(err)
          }

          self._getDeviceTokens(function (err, deviceTokens) {
            if (err) {
              debug('error getting device token')
              return reject(err)
            }

            // NOTE: this is a temporary requirement which unfortunately sends
            // the username and password via plaintext and relies on casper's
            // servers until we figure out a workaround for generating
            // X-Snapchat-Client-Auth
            if (true) {
              self._getClientAuthToken(username, password, timestamp, function (err, clientAuthToken) {
                if (err) {
                  debug('error generating client auth token')
                  return reject(err)
                } else {
                  self.signInWithData(self._makeSignInData(googleAuthToken, attestation, ptoken, clientAuthToken, deviceTokens, timestamp), username, password)
                  .then(resolve)
                  .catch(reject)
                }
              })
            } else {
              self.signInWithData(self._makeSignInData(googleAuthToken, attestation, ptoken, '', deviceTokens, timestamp), username, password)
              .then(resolve)
              .catch(reject)
            }
          })
        })
      })
    })
  }).nodeify(cb)
}

Snapchat.prototype._makeSignInData = function (googleAuthToken, attestation, ptoken, clientAuthToken, deviceTokens, timestamp) {
  return {
    googleAuthToken: googleAuthToken,
    attestation: attestation,
    pushToken: ptoken,
    clientAuthToken: clientAuthToken,
    deviceTokens: deviceTokens,
    timestamp: timestamp
  }
}

Snapchat.prototype.signInWithData = function (data, username, password, cb) {
  var self = this

  return new Promise(function (resolve, reject) {
    var googleAuthToken = data.googleAuthToken
    var attestation = data.attestation
    var ptoken = data.pushToken
    var clientAuthToken = data.clientAuthToken
    var deviceTokens = data.deviceTokens
    var timestamp = data.timestamp

    self._googleAuthToken = googleAuthToken
    self._googleAttestation = attestation
    self._deviceToken1i = deviceTokens[constants.core.deviceToken1i]
    self._deviceToken1v = deviceTokens[constants.core.deviceToken1v]

    var reqToken = StringUtils.hashSCString(constants.core.staticToken, timestamp)
    var preHash = StringUtils.getSCPreHashString(username, password, timestamp, reqToken)
    var deviceHash = StringUtils.hashHMacToBase64(preHash, self._deviceToken1v).substr(0, 20)

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

    var headers = { }
    headers[constants.headers.clientAuthToken] = 'Bearer ' + self._googleAuthToken
    headers[constants.headers.clientAuth] = clientAuthToken

    var opts = {
      'timestamp': timestamp
    }

    Request.postCustom(constants.endpoints.account.login, params, headers, null, opts, function (err, result) {
      if (result.status < 0) {
        err = new Error(result.message)
      }
      if (err) {
        debug('Snapchat.signIn error %s', err)
        return reject(err)
      } else if (result) {
        self.session = new Session(self, result)
        return resolve(self.session)
      }

      err = new Error('Snapchat.signIn parse error')
      err.data = result
      return reject(err)
    })
  }).nodeify(cb)
}

/**
 * Use this to restore a session that ended within the last hour. The google auth token must be re-generated every hour.
 *
 * @param {string} username Your Snapchat username.
 * @param {string} authToken Your Snapchat auth token. Can be retrieved from the authToken property.
 * @param {string} googleAuthToken Your Google auth token. Can be retrieved from the googleAuthToken property.
 * @param {function} cb
 */
Snapchat.prototype.restoreSession = function (username, authToken, googleAuthToken, cb) {
  var self = this
  debug('Snapchat.restoreSession (username %s)', username)

  self._username = username
  self._authToken = authToken
  self._googleAuthToken = googleAuthToken

  return self.updateSession(cb)
}

/**
 * Signs out.
 *
 * @param {function} cb
 */
Snapchat.prototype.signOut = function (cb) {
  var self = this

  return new Promise(function (resolve, reject) {
    debug('Snapchat.signOut (%s)', self.username)

    if (!self.isSignedIn) {
      return reject(new Error('signin required'))
    }

    self.post(constants.endpoints.account.logout, {
      'username': self._username
    }, function (err, result) {
      if (err) {
        debug('Snapchat.signOut error %s', err)
        return reject(err)
      } else if (result && result.length === 0) {
        self._session = null
        self._username = null
        self._authToken = null
        self._googleAuthToken = null
        self._googleAttestation = null
        self._deviceToken1i = null
        self._deviceToken1v = null
        return resolve()
      }
      return reject(new Error('Snapchat.signOut parse error'))
    })
  }).nodeify(cb)
}

/**
 * Updates all information in the session property.
 *
 * @param {function} cb
 */
Snapchat.prototype.updateSession = function (cb) {
  var self = this

  return new Promise(function (resolve, reject) {
    debug('Snapchat.updateSession')

    if (!self.isSignedIn) {
      return reject(new Error('signin required'))
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
        return reject(err)
      } else if (result) {
        self.session = new Session(self, result)
        return resolve(self.session)
      }

      return reject(new Error('updateSession error'))
    })
  }).nodeify(cb)
}

/**
 * The first step in creating a new Snapchat account.
 * Registers an email, password, and birthday in preparation for creating a new account.
 *
 * The result passed to cb has the following keys:
 *  - email: the email you registered with.
 *  - snapchat_phone_number: a number you can use to verify your phone number later.
 *  - username_suggestions: an array of available usernames for the next step.
 *
 * @param {string} email The email address to be associated with the account.
 * @param {string} password The password of the account to be created.
 * @param {string} birthday Your birthday, in the format YYYY-MM-DD.
 * @param {function} cb
 */
Snapchat.prototype.registerEmail = function (email, password, birthday, cb) {
  var self = this

  return new Promise(function (resolve, reject) {
    debug('Snapchat.registerEmail (email %s)', email)

    self.post(constants.endpoints.account.registration.start, {
      'email': email,
      'password': password,
      'birthday': birthday
    }, function (err, result) {
      if (err) {
        debug('registerEmail error %s', err)
        return reject(err)
      } else if (result && !!result.logged) {
        return resolve(result)
      }
      return reject(new Error('registerEmail parse error'))
    })
  }).nodeify(cb)
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

  return new Promise(function (resolve, reject) {
    debug('Snapchat.registerUsername (username %s, email %s)', username, registeredEmail)

    self._getGoogleAuthToken(gmailEmail, gmailPassword, function (err, googleAuthToken) {
      if (err) {
        debug('could not retrieve google auth token')
        return reject(err)
      }

      self.post(constants.endpoints.account.registration.username, {
        'username': registeredEmail,
        'selected_username': username
      }, function (err, result) {
        if (err) {
          debug('registerUsername error %s', err)
          return reject(err)
        } else if (result) {
          self.session = new Session(self, result)
          self._googleAuthToken = googleAuthToken
          return resolve()
        }
        return reject(new Error('registerUsername parse error'))
      })
    })
  }).nodeify(cb)
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

  return new Promise(function (resolve, reject) {
    debug('Snapchat.sendPhoneVerification (mobile %s, sms %d)', mobile, sms)

    if (!self.isSignedIn) {
      return reject(new Error('signin required'))
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
        return reject(err)
      }

      debug('sendPhoneVerification result %j', result)
      return resolve(result)
    })
  }).nodeify(cb)
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

  return new Promise(function (resolve, reject) {
    debug('Snapchat.verifyPhoneNumber (code %s)', code)

    if (!self.isSignedIn) {
      return reject(new Error('signin required'))
    }

    Request.post(constants.endpoints.account.registration.verifyPhone, {
      'action': 'verifyPhoneNumber',
      'username': self._username,
      'code': code
    }, self._googleAuthToken, constants.core.staticToken, function (err, result) {
      if (err) {
        debug('verifyPhoneNumber error %s', err)
        return reject(err)
      }

      debug('verifyPhoneNumber result %j', result)
      return resolve(result)
    })
  }).nodeify(cb)
}

/**
 * Downloads captcha images to verify a new account with.
 * cb will be called with an array of 9 Blobs representing captcha images.
 *
 * @param {function} cb
 */
Snapchat.prototype.getCaptcha = function (cb) {
  var self = this

  return new Promise(function (resolve, reject) {
    debug('Snapchat.getCaptcha')

    if (!self.isSignedIn) {
      return reject(new Error('signin required'))
    }

    self.post(constants.endpoints.account.registration.getCaptcha, {
      'username': self._username
    }, function (err, body) {
      if (err) {
        debug('getCaptcha error %s', err)
        return reject(err)
      }

      zlib.gunzip(new Buffer(body), function (err) {
        if (err) {
          debug('getCaptcha gunzip error %s', err)
          return reject(err)
        }

        // TODO
        return reject(new Error('Snapchat.getCaptcha TODO'))
      })
    })
  }).nodeify(cb)
}

/**
 * Use this to 'solve' a captcha.
 * @warning Seems to not be working.
 * @todo: document response
 *
 * @param {string} solution The solution to the captcha as a binary string. If the first, second, and last images contain ghosts, the solution would be '110000001'.
 * @param {function} cb
 */
Snapchat.prototype.solveCaptcha = function (solution, cb) {
  var self = this

  return new Promise(function (resolve, reject) {
    debug('Snapchat.solveCaptcha')

    if (!self.isSignedIn) {
      return reject(new Error('signin required'))
    }

    return reject(new Error('Snapchat.solveCaptcha TODO'))
  }).nodeify(cb)
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

  return new Promise(function (resolve, reject) {
    debug('Snapchat.post (%s)', endpoint)

    Request.post(endpoint, params, self._googleAuthToken, self._authToken, function (err, result) {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  }).nodeify(cb)
}

/**
 * [get description]
 *
 * @param  {string}   endpoint
 * @param  {function} cb
 */
Snapchat.prototype.get = function (endpoint, cb) {
  return new Promise(function (resolve, reject) {
    debug('Snapchat.get (%s)', endpoint)

    Request.get(endpoint, function (err, result) {
      if (err) {
        return reject(err)
      } else {
        return resolve(result)
      }
    })
  }).nodeify(cb)
}

/**
 * internal
 */
Snapchat.prototype.sendEvents = function (events, snapInfo, cb) {
  var self = this

  return new Promise(function (resolve, reject) {
    debug('Snapchat.sendEvents')

    if (!self.isSignedIn) {
      return reject(new Error('signin required'))
    }

    events = events || { }
    snapInfo = snapInfo || { }

    self._post(constants.endpoints.update.snaps, {
      'events': events,
      'json': snapInfo,
      'username': self._username
    }, function (err, result) {
      if (err) {
        debug('sendEvents error %s', err)
        return reject(err)
      }

      debug('sendEvents result %j', result)
      return resolve(result)
    })
  }).nodeify(cb)
}

/**
 * @private
 */
Snapchat.prototype._getGoogleAuthToken = function (gmailEmail, gmailPassword, cb) {
  return new Promise(function (resolve, reject) {

    var googleCache = configs.get(StringUtils.hashHMacToBase64(gmailEmail, gmailPassword))
    if (googleCache) {
      return resolve(googleCache)
    }

    var encryptedGmailPassword = StringUtils.encryptGmailPassword(gmailEmail, gmailPassword)

    Request.postRaw({
      'url': 'https://android.clients.google.com/auth',
      'form': {
        'google_play_services_version': '7097038',
        'device_country': 'us',
        'operatorCountry': 'us',
        'lang': 'en_US',
        'sdk_version': '19',
        'accountType': 'HOSTED_OR_GOOGLE',
        'Email': gmailEmail,
        'EncryptedPasswd': encryptedGmailPassword,
        // 'Passwd': gmailPassword, // unencrypted version
        'service': 'audience:server:client_id:694893979329-l59f3phl42et9clpoo296d8raqoljl6p.apps.googleusercontent.com',
        'source': 'android',
        'androidId': '378c184c6070c26c',
        'app': 'com.snapchat.android',
        'client_sig': '49f6badb81d89a9e38d65de76f09355071bd67e7',
        'callerPkg': 'com.snapchat.android',
        'callerSig': '49f6badb81d89a9e38d65de76f09355071bd67e7'
      },
      'headers': {
        'device': '378c184c6070c26c',
        'app': 'com.snapchat.android',
        'Accept-Encoding': 'gzip',
        'User-Agent': 'GoogleAuth/1.4 (mako JDQ39)'
      }
    }, function (err, response, body) {
      if (err) {
        debug('_getGoogleAuthToken error %s', err)
        return reject(err)
      } else if (body) {
        var auth = StringUtils.matchGroup(body, /Auth=([\w\.-]+)/i, 1)
        if (auth) {
          configs.set(StringUtils.hashHMacToBase64(gmailEmail, gmailPassword), auth)
          return resolve(auth)
        }
      }

      return reject(new Error('Snapchat._getGoogleAuthToken unknown error'))
    })

  }).nodeify(cb)
}

// static cache of device tokens
var sDeviceToken1i = null
var sDeviceToken1v = null

/**
 * @private
 */
Snapchat.prototype._getDeviceTokens = function (cb) {
  // cache device tokens
  var dt1i = sDeviceToken1i
  var dt1v = sDeviceToken1v

  function completion () {
    var result = { }
    result[constants.core.deviceToken1i] = dt1i
    result[constants.core.deviceToken1v] = dt1v

    return cb(null, result)
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
      return cb('Snapchat._getDeviceTokens parse error')
    })
  }
}

/**
 * ptoken value
 * @private
 */
Snapchat.prototype._getGoogleCloudMessagingIdentifier = function (cb) {
  var DEFAULT_TOKEN = 'ie'

  process.nextTick(function () {
    cb(null, DEFAULT_TOKEN)
  })

  // TODO: cloud messaging identifier always returns 'Error=AUTHENTICATION_FAILED'
  // skipping this for now to speedup testing

  /*
  Request.postRaw({
    url: 'https://android.clients.google.com/c2dm/register3',
    form: {
      'X-google.message_id': 'google.rpc1',
      'device': 4343470343591528399,
      'sender': 191410808405,
      'app_ver': 706,
      'gcm_ver': 7097038,
      'app': 'com.snapchat.android',
      'iat': (new Date()).getTime(),
      'cert': '49f6badb81d89a9e38d65de76f09355071bd67e7'
    },
    headers: {
      'Accept-Language': 'en',
      'Accept-Locale': 'en_US',
      'app': 'com.snapchat.android',
      'Authorization': 'AidLogin 4343470343591528399:5885638743641649694',
      'Gcm-ver': '7097038',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'Android-GCM/1.5 (A116 _Quad KOT49H)'
    }
  }, function (err, response, body) {
    if (err) {
      return cb(err)
    } else if (body) {
      // parse token
      var token = StringUtils.matchGroup(body, /token=([\w\.-]+)/, 1)

      if (token) {
        return cb(null, token)
      } else {
        // debug('_getGoogleCloudMessagingIdentifier using default token %s', body)

        // default token
        return cb(null, DEFAULT_TOKEN)
      }
    }

    debug('_getGoogleCloudMessagingIdentifier parse error %s', body)
    return cb('_getGoogleCloudMessagingIdentifier error')
  })*/
}

/**
 * Attestation, courtesy of casper.io
 * @private
 */
Snapchat.prototype._getAttestation = function (username, password, ts, cb) {
  return new Promise(function (resolve, reject) {

    Request.get(constants.attestation.URLCasperDroidGuardBinary, function (err, result) {
      if (err) {
        debug('Attstation droidguarbinary error %s', err)
        result = {
          'binary': constants.attestation.droidGuard
        }
      }

      Request.postRaw({
        'uri': 'https://www.googleapis.com/androidantiabuse/v1/x/create',
        'qs': {
          'alt': 'PROTO',
          'key': 'AIzaSyBofcZsgLSS7BOnBjZPEkk4rYwzOIz-lTI'
        },
        'body': new Buffer(result.binary, 'base64'),
        'headers': {
          'User-Agent': 'DroidGuard/7329000 (A116 _Quad KOT49H); gzip',
          'Content-Type': 'application/x-protobuf'
        }
      }, function(err, response, result){
        if (err) {
          debug('Attstation googleantiabuse error %s', err)
          return reject(err)
        }
        var preHash = StringUtils.getSCPreHashString(username, password, ts, constants.endpoints.account.login)
        var nonce = StringUtils.sha256HashToBase64(preHash)

        Request.postRaw({
          'uri': constants.attestation.URLCasperAttestationBinary,
          'form': {
            'bytecode_proto': result.toString('base64'),
            'nonce': nonce,
            'apk_digest': constants.attestation.digest()
          }
        }, function(err, response, result){
          if (err) {
            debug('Attstation casper error %s', err)
            return reject(err)
          }
          var postData = new Buffer(result.binary, 'base64')

          Request.postRaw({
            'uri': 'https://www.googleapis.com/androidcheck/v1/attestations/attest',
            'qs': {
              'alt': 'JSON',
              'key': 'AIzaSyDqVnJBjE5ymo--oBJt3On7HQx9xNm1RHA'
            },
            'body': postData,
            'headers': {
              'User-Agent': 'SafetyNet/7899000 (WIKO JZO54K); gzip',
              'Content-Type': 'application/x-protobuf',
              'Content-Length': postData.length
            }
          }, function(err, response, result){
            if (err) {
              debug('Attstation androidcheck error %s', err)
              return reject(err)
            }
            return resolve(result.signedAttestation)
          })
        })
      })
    })
  }).nodeify(cb)
}

/**
 * Client Auth Token, courtesy of casper.io
 *
 * Note that casper.io uses libscplugin.so which has been extracted from the
 * Android Snapchat client.
 *
 * @private
 */
Snapchat.prototype._getClientAuthToken = function (username, password, ts, cb) {
  return new Promise(function (resolve, reject) {

    Request.postRaw({
      'url': constants.attestation.URLCasperAuth,
      'form': {
        'username': username,
        'password': password,
        'timestamp': ts
      }
    }, function (err, response, result) {
      if (err) {
        return reject(err)
      // NOTE:
      // - currently still using the old version see (https://github.com/fisch0920/snapchat/issues/7),
      //   new version uses: +result.code === 200
      } else if (result && +result.status === 200 && result.signature) {
        return resolve(result.signature)
      }

      return reject(new Error('Snapchat._getClientAuthToken unknown error'))
    })

  }).nodeify(cb)
}

/**
 * Removes previously cached values
 *
 * @param {string} Optional gmailEmail A valid GMail address.
 * @param {string} Optional gmailPassword The password associated with gmailEmail.
 *
 * @private
 */
Snapchat.prototype._clearCache = function (gmailEmail, gmailPassword) {
  if (!(gmailEmail && gmailPassword)) {
    return configs.clear()
  }
  if (gmailEmail && gmailPassword) {
    configs.del(StringUtils.hashHMacToBase64(gmailEmail, gmailPassword))
  }
}
