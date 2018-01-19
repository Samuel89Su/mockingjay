/**
 * Module dependencies.
 */
var http = require('http')
var connect = require('connect')
var proxy = require('http-proxy-middleware');
const ProxyContext = require('./src/context')
const ProxyTarget = require('./src/target')
const ProxyRouter = require('./src/router')

/**
 * Configure proxy middleware
 */
var jsonPlaceholderProxy = proxy({
  target: 'http://localhost:57761',
  changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
  logLevel: 'debug'
})

var app = connect()

/**
 * Add the proxy to connect
 */
app.use('/', jsonPlaceholderProxy)

http.createServer(app).listen(3200)

console.log('[DEMO] Server: listening on port 3200')
console.log('[DEMO] Opening: http://localhost:3200/users')

require('opn')('http://localhost:3200/teacher/')