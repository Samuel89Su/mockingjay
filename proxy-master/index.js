/**
 * Module dependencies.
 */
const http = require('http')
const connect = require('connect')
const proxy = require('http-proxy-middleware')
const defaultOpts = require('./defaultOpts')
const fs = require('fs')
const rawUserOpts = fs.readFileSync('./opts.json')

try {
  const userOpts = JSON.parse(rawUserOpts)
  const context = userOpts.context
  delete userOpts.context
  const opts = Object.assign({}, userOpts, defaultOpts)
  
  /**
   * Configure proxy middleware
   */
  const userProxy = proxy(context, opts)

  const app = connect()

  /**
   * Add the proxy to connect
   */
  app.use('/', userProxy)

  http.createServer(app).listen(3200, '172.16.211.123')

} catch (error) {
  console.log(error)
}

console.log('Proxy Server: listening on port 3200')