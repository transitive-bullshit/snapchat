module.exports = Request

var debug = require('debug')('snapchat:request')
var https = require('https')
var request = require('request')
var urljoin = require('url-join')
var extend = require('xtend')
var zlib = require('zlib')
var iconv = require('iconv-lite')

var BufferUtils = require('./buffer-utils')
var StringUtils = require('./string-utils')
var constants = require('./constants')

/**
 * Snapchat wrapper for HTTP requests
 *
 * @class
 * @param {Object} opts
 */
function Request (opts) {
  var self = this
  if (!(self instanceof Request)) return new Request(opts)
  if (!opts) opts = {}

  self.HTTPMethod = opts.method
  self.HTTPHeaders = {}
  self.opts = opts

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
    var body = [ ]

    for (var key in opts.params) {
      if (key === 'data') {
        body.push(BufferUtils.boundaryForBuffer(key, opts.params[key]))
      } else {
        body.push(BufferUtils.boundaryForString(key, opts.params[key]))
      }
    }

    // final boundary
    body.push(new Buffer('\r\n--' + constants.core.boundary + '--\r\n'))

    // concat all buffers together to form the body
    self.HTTPBody = Buffer.concat(body)
    self.multipart = true

    // debugging...
    // var fs = require('fs')
    // fs.writeFileSync('out.txt', self.HTTPBody.toString('utf-8'))
    // console.log(self.HTTPBody.toString('utf-8'))
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

/**
 * Initiates the underlying HTTP request Request.httpRequest.
 *
 * @param {function} cb
 */
Request.prototype.start = function (cb) {
  var self = this

  function wrapcb (err, response, body) {
    var contentType = response && response.headers && response.headers['content-type']
    if (contentType && contentType !== 'application/octet-stream') {
      response.body = iconv.decode(response.body, 'utf8')
    }

    if (err) {
      return cb(err, body)
    } else if (!err && response && (response.statusCode < 200 || response.statusCode >= 300)) {
      // catch snapchat API error codes
      debug('Snapchat Request Error: %d (%s) \nendpoint: %s \nheaders: %j \nrequest: %s',
            response.statusCode,
            response.statusMessage,
            self.opts.endpoint,
            response.request.headers,
            self.multipart ? '' : response.request.body.toString('utf-8').substr(0, 80))

      // console.log(response)
      // console.log(response.request.body.toString('base64'))
      // console.log(response.request.body.toString('utf-8'))

      return cb('Snapchat API error ' + response.statusCode + ' (' + response.statusMessage + ')', body)
    } else {
      var result = body

      // attempt to parse the body as JSON if appropriate
      if (contentType && contentType.indexOf('application/json') >= 0) {
        result = StringUtils.tryParseJSON(body)

        if (!result) {
          debug('Snapchat Request JSON Parse Error: \nresponse: "%s"', body)
          // return cb('JSON parse error', body)
        }
      }

      return cb(null, result)
    }
  }

  if (self.HTTPMethod === 'POST') {
    if (self.multipart) {
      self.HTTPHeaders['content-length'] = Buffer.byteLength(self.HTTPBody)

      // self.HTTPHeaders['X-Timestamp'] = 0

      // TODO:
      // neither objc or php versions send Content-Length header
      // don't think we can use request because its multipart/form-data uses random boundary

      var req = https.request({
        host: constants.core.baseURL.replace(/http?s:\/\//, ''),
        path: self.endpoint,
        method: 'POST',
        headers: self.HTTPHeaders,
        agent: false,
        rejectUnauthorized: false
        //, secureOptions: require('constants').SSL_OP_NO_TLSv1
      }, function (response) {
        response.request = req
        response.request.headers = req._headers

        console.log('status', response.statusCode)
        console.log('headers', JSON.stringify(response.headers))

        var result = []
        response.on('data', function (chunk) {
          console.log('RESPONSE DATA', chunk)
          result.push(chunk)
        })

        response.on('end', function () {
          console.log('RESPONSE END')
          response.body = Buffer.concat(result)
          wrapcb(null, response, response.body)
        })
      })

      // req.removeHeader('content-length')
      // req.removeHeader('transfer-encoding')
      // req.removeHeader('connection')

      req.on('error', function (err) {
        console.error('ERROR', err)
        wrapcb(err, null, null)
      })

      req.on('abort', function () {
        console.error('ABORT')
        wrapcb('abort', null, null)
      })

      req.write(self.HTTPBody)
      req.end()
      console.log('REQUEST END', req._headers)
    } else {
      self.httpRequest = request.post({
        url: self.URL,
        headers: self.HTTPHeaders,
        form: self.HTTPBody,
        encoding: null
      }, wrapcb)

      // debug('%s Request %s (headers %j) (body \'%s\')', self.HTTPMethod, self.URL, self.HTTPHeaders,
      //       self.httpRequest.body.toString('utf-8'))
    }
  } else {

    self.httpRequest = request({
      url: self.URL,
      headers: self.HTTPHeaders,
      encoding: null
    }, wrapcb)

    debug('%s Request %s (headers %j)', self.HTTPMethod, self.URL, self.HTTPHeaders)
  }
}

// -----------------------------------------------------------------------------
// static utility methods
// -----------------------------------------------------------------------------

/**
 * @static
 * @param {string=} endpoint Optional endpoint of the request relative to the base URL.
 * @param {Object=} params Optional parameters for the request.
 * @param {string=} gauth Optional parameter set to the X-Snapchat-Client-Auth-Token header field.
 * @param {string=} token Optional snapchat auth token returned from logging in.
 * @param {Object=} opts Optional custom options.
 * @param {function} cb
 * @return {Request} new Request wrapping this HTTP POST request.
 */
Request.post = function (endpoint, params, gauth, token, opts, cb) {
  // handle optional parameters
  if (typeof params === 'function') {
    cb = params
    params = { }
    gauth = token = opts = null
  } else if (typeof gauth === 'function') {
    cb = gauth
    gauth = token = opts = null
  } else if (typeof token === 'function') {
    cb = token
    token = opts = null
  } else if (typeof opts === 'function') {
    cb = opts
    opts = null
  }

  var headers = { }
  headers[constants.headers.clientAuthToken] = 'Bearer ' + (gauth || '')

  return Request.postCustom(endpoint, params, headers, token, opts, cb)
}

/**
 * @static
 * @param {string} endpoint endpoint of the request relative to the base URL.
 * @param {Object} params parameters for the request.
 * @param {Object} headers Custom HTTP headers for this request.
 * @param {string} token snapchat auth token returned from logging in.
 * @param {Object=} opts Optional custom options.
 * @param {function} cb
 * @return {Request} new Request wrapping this HTTP POST request.
 */
Request.postCustom = function (endpoint, params, headers, token, opts, cb) {
  // handle optional parameters
  if (typeof opts === 'function') {
    cb = opts
    opts = null
  }

  opts = opts || { }

  var request = new Request(extend({
    method: 'POST',
    endpoint: endpoint,
    token: token,
    params: params,
    headers: headers
  }, opts))

  request.start(cb)
  return request
}

/**
 * @static
 * @param {string} endpoint The endpoint of the request relative to the base URL.
 * @param {function} cb
 * @return {Request} new Request wrapping this HTTP GET request
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
 * @return {Request} new Request wrapping this events HTTP POST request
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

Request.postRaw = function (params, cb) {
  request.post(extend(params, {
    encoding: null
  }), function (err, response, body) {
    if (err) {
      return cb(err, response, body)
    }

    var contentType = response.headers['content-type']
    var encoding = response.headers['content-encoding']

    function contentTypeWrapper (err, body) {
      if (err) {
        return cb(err, response, body)
      } else if (contentType.indexOf('application/json') >= 0) {
        return cb(err, response, StringUtils.tryParseJSON(body.toString()))
      } else if (contentType.indexOf('text/plain') >= 0) {
        return cb(err, response, body.toString())
      } else {
        return cb(err, response, body)
      }
    }

    if (encoding === 'gzip') {
      zlib.gunzip(body, function (err, dezipped) {
        contentTypeWrapper(err, dezipped && dezipped.toString())
      })
    } else if (encoding === 'deflate') {
      zlib.inflate(body, function (err, decoded) {
        contentTypeWrapper(err, decoded && decoded.toString())
      })
    } else {
      contentTypeWrapper(err, body)
    }
  })
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
