'use strict'

/**
 * Module dependencies.
 */
const http = require('http')
const connect = require('connect')
const proxy = require('http-proxy-middleware')
const { URL } = require('url')
const { host, port } = require('./cfg')
const serveStatic = require('serve-static')
const ws = require('./ws')
const proxyEventEmitter = require('./eventEmitter')
const defaultProxy = require('./proxy/default')(proxyEventEmitter)

try {

  const app = connect()
  
  /**
   * Add the proxy to connect
   */
  app.use('/', defaultProxy)

  const serve = serveStatic('static', { 'index': ['index.html'] })
  app.use(serve)

  http.createServer(app).listen(port, host)

} catch (error) {
  console.log(error)
}

console.log('Proxy Server: listening on port 3200')