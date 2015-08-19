module.exports = SKLocation

var Filter = require('./filter')

/**
 * Snapchat location-specific data
 *
 * @class
 *
 * @param {Object} params
 */
function SKLocation (params) {
  var self = this
  if (!(self instanceof SKLocation)) return new SKLocation(params)

  self.weather = params['weather']
  self.ourStoryAuths = params['our_story_auths']
  self.preCacheGeofilters = params['pre_cache_geofilters']

  self.filters = params['filters'].map(function (filter) {
    return new Filter(filter)
  })
}
