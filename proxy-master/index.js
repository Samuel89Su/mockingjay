'use strict'

/**
 * Module dependencies.
 */
const http = require('http')
const connect = require('connect')
const path = require('path')
const { host, port, staticRoot } = require('./defaultConfig')
const serveStatic = require('serve-static')
const ws = require('./src/ws')
const proxyEventEmitter = require('./src/eventEmitter')
const defaultProxy = require('./src/proxy')(proxyEventEmitter)

try {

  const app = connect()

  // 添加添加静态资源服务
  const staticRootDir = path.resolve(staticRoot)
  const serve = serveStatic(staticRootDir, { 'index': ['index.html'] })
  app.use(serve)

  // 添加代理中间件
  app.use('/', defaultProxy)

  http.createServer(app).listen(port, host)

} catch (error) {
  console.log(error)
}

console.log('Proxy Server: listening on port ' + port)