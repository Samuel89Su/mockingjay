
// function logProvider(provider) {
//   var logger = new (require('winston').Logger)();

//   var defaultProvider = {
//       log: logger.log,
//       debug: logger.debug,
//       info: logger.info,
//       warn: logger.warn,
//       error: logger.error
//   }
//   return defaultProvider;
// }

exports = module.exports = {
  changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
  // logLevel: 'info',
  // logProvider: logProvider
}