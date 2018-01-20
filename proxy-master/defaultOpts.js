const Bunyan = require('bunyan')

const defaultLogger = Bunyan.createLogger(
    {
        name: 'default',
        level: 'info',
        streams: [{
            level: 'info',
            type: 'rotating-file',
            path: 'logs/proxy.log',
            count: 30
        }]
    })


exports = module.exports = {
  changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
  logLevel: 'info',
  logProvider: function(provider) {
      return defaultLogger
  }
}