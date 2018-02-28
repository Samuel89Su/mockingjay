/**
 * Module dependencies.
 */
const http = require('http')
const connect = require('connect')
const proxy = require('http-proxy-middleware')
const { URL } = require('url')
const { host, port } = require('./cfg')
const serveStatic = require('./serve-static')
const defaultOpts = require('./defaultOpts')
const userOpts = require('./opts')

try {
  const opts = Object.assign({}, userOpts, defaultOpts)
  const filter = opts.filter
  delete opts.context

  const app = connect()
  
  /**
   * Configure proxy middleware
   */
  const userProxy = filter ? proxy(filter, opts) : proxy(opts)
  /**
   * Add the proxy to connect
   */
  app.use('/', userProxy)

  const serve = serveStatic('static', { 'index': ['index.html'], mockDotNetMVCRoute: true })
  app.use(serve)

  http.createServer(app).listen(port, host)

} catch (error) {
  console.log(error)
}

console.log('Proxy Server: listening on port 3200')