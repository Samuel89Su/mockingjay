'use strict'

/**
 * Module dependencies.
 */
const http = require('http')
const connect = require('connect')
const { host, port } = require('./cfg')
const serveStatic = require('serve-static')
const ws = require('./src/ws')
const proxyEventEmitter = require('./src/eventEmitter')
const defaultProxy = require('./src/proxy')(proxyEventEmitter)

try {

  const app = connect()

  // 添加代理中间件
  app.use('/', defaultProxy)

  // 添加添加静态资源服务
  const serve = serveStatic('static', { 'index': ['index.html'] })
  app.use(serve)

  http.createServer(app).listen(port, host)

} catch (error) {
  console.log(error)
}

console.log('Proxy Server: listening on port 3200')