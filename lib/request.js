module.exports = Request

var request = require('request')
var urljoin = require('url-join')
var extend = require('xtend')

var StringUtils = require('./string-utils')
var constants = require('./constants')

/**
 * Snapchat Request
 *
 * @param {Object} opts
 */
function Request (opts) {
  var self = this
  if (!(self instanceof Request)) return new Request(opts)
  if (!opts) opts = {}

  self.HTTPMethod = opts.method
  self.HTTPHeaders = {}

  if (opts.method === 'POST') {
    if (opts.endpoint) {
      self._initPOST(opts)
    } else if (opts.url) {
      self._initPOSTURL(opts)
    } else {
      throw new Error('invalid request')
    }
  } else if (opts.method === 'GET') {
    self._initGET(opts)
  } else {
    throw new Error('invalid request')
  }
}

Request.prototype._initHeaderFields = function (headers) {
  var self = this

  self.HTTPHeaders[constants.headers.contentType] = 'application/x-www-form-urlencoded'
  self.HTTPHeaders[constants.headers.userAgent] = constants.core.userAgent
  self.HTTPHeaders[constants.headers.acceptLanguage] = constants.headers.values.language
  self.HTTPHeaders[constants.headers.acceptLocale] = constants.headers.values.locale

  if (headers) {
    self.HTTPHeaders = extend(self.HTTPHeaders, headers)
  }
}

/**
 * Automatically adds query parameters:
 * - timestamp
 * - req_token
 * Automatically adds HTTP header fields:
 * - User-Agent
 * - Accept-Language
 * - Accept-Locale
 * - Content-Type
 */
Request.prototype._initPOST = function (opts) {
  var self = this

  Request._applyHeaderOverrides(opts)
  opts.token = opts.token || constants.core.staticToken

  self._initHeaderFields(opts.headers)
  Request._applyOverrides(opts)

  self.URL = urljoin(constants.core.baseURL, opts.endpoint)

  if (!opts.timestamp) {
    opts.timestamp = StringUtils.timestamp()
  }

  var reqToken = 'req_token'
  if (!opts.params[reqToken]) {
    opts.params[reqToken] = StringUtils.hashSCString(opts.token, opts.timestamp)
  }

  if (!opts.params.timestamp) {
    opts.params.timestamp = +opts.timestamp
  }

  // special-case for uploading snaps
  if (opts.endpoint === constants.endpoints.snaps.upload) {
    // TODO: this is tricky
    throw new Error('not yet implemented')

    /*
    NSMutableData *body = [NSMutableData data];

    for (NSString *key in json.allKeys) {
      if ([key isEqualToString:@'data']) {
        [body appendData:[NSData boundaryWithKey:key forDataValue:json[key]]];
      } else {
        [body appendData:[NSData boundaryWithKey:key forStringValue:(NSString *)json[key]]];
      }
    }

    [body appendData:[[NSString stringWithFormat:@'\r\n--%@--\r\n', SKConsts.boundary] dataUsingEncoding:NSUTF8StringEncoding]];

    self.HTTPBody = body;
    */
  } else {
    self.HTTPBody = opts.params
  }

  if (opts.endpoint === constants.endpoints.snaps.loadBlob || opts.endpoint === constants.endpoints.chat.media) {
    self.HTTPHeaders[constants.headers.timestamp] = opts.timestamp
  }
}

Request.prototype._initPOSTURL = function (opts) {
  var self = this

  self.URL = opts.url
  self.HTTPBody = opts.eventData
}

/**
 * Automatically adds HTTP header fields:
 * - User-Agent
 * - Accept-Language
 * - Accept-Locale
 * - Content-Type
 */
Request.prototype._initGET = function (opts) {
  var self = this

  Request._applyHeaderOverrides(opts)
  self._initHeaderFields(opts.headers)

  self.URL = urljoin(constants.core.baseURL, opts.endpoint)
}

Request.prototype.start = function (cb) {
  var self = this

  if (self.HTTPMethod === 'POST') {
    request.post({
      url: self.URL,
      headers: self.HTTPHeaders,
      form: self.HTTPBody
    }, cb)
  } else {
    request({
      url: self.URL,
      headers: self.HTTPHeaders
    }, cb)
  }
}

/**
 * @static
 * @param {string} endpoint The endpoint of the request relative to the base URL.
 * @param {Object} params The parameters for the request.
 * @param {string} gauth Optional parameter set to the X-Snapchat-Client-Auth-Token header field.
 * @param {string} token The Snapchat auth token returned from logging in. Used to set the req_token parameter for requests.
 * @param {function} cb
 */
Request.postTo = function (endpoint, params, gauth, token, cb) {
  var headers = { }
  headers[constants.headers.clientAuthToken] = 'Bearer ' + (gauth || '')

  return Request.postTo2(endpoint, params, headers, token, cb)
}

/**
 * @static
 * @param {string} endpoint The endpoint of the request relative to the base URL.
 * @param {Object} params The parameters for the request.
 * @param {Object} headers Optional. Sets the corresponding header fields.
 * @param {string} token The Snapchat auth token returned from logging in. Used to set the req_token parameter for requests.
 * @param {function} cb
 */
Request.postTo2 = function (endpoint, params, headers, token, cb) {
  var request = new Request({
    method: 'POST',
    endpoint: endpoint,
    token: token,
    params: params,
    headers: headers
  })

  request.start(cb)
  return request
}

/**
 * @static
 * @param {string} endpoint The endpoint of the request relative to the base URL.
 * @param {function} cb
 */
Request.get = function (endpoint, cb) {
  var request = new Request({
    method: 'GET',
    endpoint: endpoint
  })

  request.start(cb)
  return request
}

/**
 * @static
 * @param {Object} eventData
 * @param {function} cb
 */
Request.sendEvents = function (eventData, cb) {
  var request = new Request({
    method: 'POST',
    url: constants.core.eventsURL,
    eventData: eventData
  })

  request.start(cb)
  return request
}

// -----------------------------------------------------------------------------
// override handling
// -----------------------------------------------------------------------------

Request.overrideHeaderValuesGlobally = function (headers) {
  globalHeaderOverrides = headers
}

Request.overrideHeaderValues = function (headers, endpoint) {
  scopeHeaderOverrides[endpoint] = headers
}

Request.overrideValues = function (params, endpoint) {
  scopeParamOverrides[endpoint] = params
}

Request.overrideValuesGlobally = function (params) {
  globalParamOverrides = params
}

Request.overrideEndpoints = function (endpoints) {
  endpointOverrides = endpoints
}

Request._applyOverrides = function (opts) {
  if (opts.params) {
    opts.params = extend(opts.params, globalParamOverrides)
    opts.params = extend(opts.params, scopeParamOverrides[opts.endpoint] || { })
  }

  if (opts.endpoint) {
    opts.endpoint = endpointOverrides[opts.endpoint] || opts.endpoint
  }
}

Request._applyHeaderOverrides = function (opts) {
  if (!opts.headers) return

  opts.headers = extend(opts.headers, globalHeaderOverrides)
  opts.headers = extend(opts.headers, scopeHeaderOverrides[opts.endpoint] || { })
}

var globalHeaderOverrides = { }
var globalParamOverrides = { }
var scopeParamOverrides = { }
var scopeHeaderOverrides = { }
var endpointOverrides = { }
