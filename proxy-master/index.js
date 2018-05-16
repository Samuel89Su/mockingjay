'use strict'

/**
 * Module dependencies.
 */
const http = require('http')
const express = require('express')
const path = require('path')
const config = require('./src/config')
const ws = require('./src/ws')(config.port)
const defaultProxy = require('./src')()
const { controlRouter, consoleRouter } = require('./src/router')

try {

  const app = express()

  app.use('/control', controlRouter)
  app.use('/console', consoleRouter)

  // 添加静态资源服务
  const staticRootDir = path.resolve(config.static)
  let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: 'index.html',
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }
  app.use(express.static(staticRootDir, options))

  // 添加代理中间件
  app.use('/', defaultProxy)

  http.createServer(app).listen(config.port, config.host)

} catch (error) {
  console.log(error)
}

console.log('Proxy Server: listening on port ' + config.port)