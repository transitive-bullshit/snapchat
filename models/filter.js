module.exports = Filter

/**
 * Snapchat Filter
 *
 * @param {Object} params
 */
function Filter (params) {
  var self = this
  if (!(self instanceof Filter)) return new Filter(params)

  self.identifier = params['filter_id']
  self.priority = params['priority'] | 0
  self.hideSponsoredSlug = !!params['hide_spondored_slug']
  self.imageURL = params['image']
  self.isDynamic = !!params['is_dynamic_geofilter']
  self.isSponsored = !!params['is_sponsoed']
  self.position = params['position']
  self.prepositioned = !!params['prepositioned']
  self.prepositionedImageURL = params['prepositioned_image']

  var geofence = params['geofence']
  var coords = geofence['coordinates']

  self.geofenceIdentifier = geofence['id']
  self.coordinates = (coords || [ ]).map(function (coord) {
    return {
      lat: coord['lat'],
      lng: coord['long']
    }
  })
}
