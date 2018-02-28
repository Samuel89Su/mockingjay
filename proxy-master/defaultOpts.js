const { URL } = require('url')
const queryString = require('query-string')

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
  // logProvider: logProvider,
  onProxyReq: onProxyReq,
  onProxyRes: onProxyRes
}

function onProxyReq(proxyReq, req, res) {
  // add custom header to request 
  proxyReq.setHeader('x-added', 'foobar');
  // or log the req 
}

function onProxyRes(proxyRes, req, res) {
  if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
    let location = proxyRes.headers.location
    // let url = new URL(req.headers.host + location)
    let search = location.substr(location.indexOf('?'))
    let query = queryString.parse(search)
    if (query.fromurl) {
      let redirectUrl = new URL(query.fromurl)
      if (redirectUrl.host === 'teacher.235.mistong.com' || redirectUrl.host === 'my.235.mistong.com') {
        console.log('origin redirect url: ' + location)

        query.fromurl = query.fromurl.replace(redirectUrl.host, 'localhost:3200')
        proxyRes.headers.location = proxyRes.headers.location.replace(search, '?' + queryString.stringify(query))
      }
    }
    console.log('modified redirect to: ' + proxyRes.headers.location)
  }
  proxyRes.headers['x-added'] = 'foobar';     // add new header to response 
  delete proxyRes.headers['x-removed'];       // remove header from response 
}