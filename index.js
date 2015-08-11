module.exports = Snapchat

var debug = require('debug')('snapchat')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

var constants = require('./lib/constants')

inherits(Snapchat, EventEmitter)

/**
 * Snapchat Client
 *
 * @param {Object} opts
 */
function Snapchat (opts) {
  var self = this
  if (!(self instanceof Snapchat)) return new Snapchat(opts)
  if (!opts) opts = {}
  EventEmitter.call(self)

  debug('new snapchat client (username %s)', self.username)
}

/**
 * Whether or not this client is signed in.
 *
 * @type {boolean}
 */
Object.defineProperty(Snapchat.prototype, 'isSignedIn', {
})

/**
 * Signs into Snapchat.
 *
 * A valid GMail account is necessary to trick Snapchat into thinking we're using the first party client. Your data is only ever sent to Google, Scout's honor.
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
}

/**
 * Signs out.
 *
 * @param {function} cb
 */
Snapchat.prototype.signOut = function (cb) {
  var self = this
  debug('Snapchat.signOut')
}

/**
 * Updates all information in the \c currentSession property.
 *
 * @param {function} cb
 */
Snapchat.prototype.updateSession = function (cb) {
  var self = this
  debug('Snapchat.updateSession')
}

/**
 * The first step in creating a new Snapchat account. Registers an email, password, and birthday in preparation for creating a new account.
 *
 * The result passed to cb has the following keys:
 *  - \c email:                 the email you registered with.
 *  - \c snapchat_phone_number: a number you can use to verify your phone number later.
 *  - \c username_suggestions:  an array of available usernames for the next step.
 *
 * @param {string} email The email address to be associated with the account.
 * @param {string} password The password of the account to be created.
 * @param {string} birthday Your birthday, in the format YYYY-MM-DD.
 * @param {function} cb
 */
Snapchat.prototype.registerEmail = function (email, password, birthday, cb) {
  var self = this
  debug('Snapchat.registerEmail (email %s)', email)
}

/**
 * The second step in creating a new Snapchat account.
 * Registers a username with an email that was registered in the first step.
 * You must call this method after successfully completing the first step in registration.
 *
 * @param {string} username The username of the account to be created, trimmed to the first 15 characters.
 * @param {string} registeredEmail The email address to be associated with the account, used in the first step of registration.
 * @param {string} gmailEmail A valid GMail address. Required to make Snapchat think this is an official client.
 * @param {string} gmailPassword The password to the Google account associated with gmailEmail.
 * @param {function} cb
 */
Snapchat.prototype.registerUsername = function (username, registeredEmail, gmailEmail, gmailPassword, cb) {
  var self = this
  debug('Snapchat.registerUsername (username %s, email %s)', username, registeredEmail)
}

/**
 * The third and final step in registration.
 * If you don't want to verify your humanity a phone number,
 * you can verify it by with a "captcha" image of sorts.
 *
 * @param {string} mobile A 10-digit (+ optional country code, defaults to 1) mobile phone number to be associated with the account, in any format. i.e. +11234567890, (123) 456-7890, 1-1234567890
 * @param {boolean} sms YES if you want a code sent via SMS, NO if you want to be called for verification.
 * @param {function} cb
 */
Snapchat.prototype.sendPhoneVerification = function (mobile, sms, cb) {
  var self = this
  debug('Snapchat.sendPhoneVerification (mobile %s, sms %d)', mobile, sms)
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
}

/**
 * Use this to "solve" a captcha.
 * @warning Seems to not be working.
 * @todo: document response
 *
 * @param {string} solution The solution to the captcha as a binary string. If the first, second, and last images contain ghosts, the solution would be \c "110000001".
 * @param {function} cb
 */
Snapchat.prototype.solveCaptcha = function (solution, cb) {
  var self = this
  debug('Snapchat.solveCaptcha')
}
