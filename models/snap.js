module.exports = Snap

/**
 * Snapchat Snap
 *
 * @class
 *
 * @param {Object} params
 */
function Snap (params) {
  var self = this
  if (!(self instanceof Snap)) return new Snap(params)

  // null until you call load
  self.blob = null

  // null if snap is outgoing
  self.sender = params['sn']

  // null if snap is incoming
  self.recipient = params['rp']

  self.identifier = params['id']
  self.conversationIdentifier = params['c_id']
  self.mediaKind = params['m'] | 0
  self.status = params['st'] | 0
  self.screenshots = params['c'] | 0
  // 0 if snap is outgoing
  self.timer = params['t'] | 0
  // actual length of the video or the same as timer for images. 0 if snap is outgoing
  self.mediaTimer = +params['rp']
  self.sentDate = new Date(+(params['sts'] || params['ts']))
  self.zipped = !!params['zipped']
}

// TODO: Snap.load is currently unused
