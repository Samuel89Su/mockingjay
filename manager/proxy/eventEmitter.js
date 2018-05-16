const EventEmitter = require('events')

class ProxyEventEmitter extends EventEmitter {}

exports = module.exports = new ProxyEventEmitter()