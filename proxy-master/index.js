'use strict'

/**
 * Module dependencies.
 */
const http = require('http')
const express = require('express')
const path = require('path')
const {
  host,
  port,
  staticRoot
} = require('./defaultConfig')
// const ws = require('./src/ws')
const defaultProxy = require('./src/proxy')()
const router = require('./router')

try {

  const app = express()

  // 添加代理中间件
  app.use('/', defaultProxy)

  // 添加静态资源服务
  const staticRootDir = path.resolve(staticRoot)
  let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }
  app.use(express.static(staticRootDir, options))

  app.use('/control', router)

  http.createServer(app).listen(port, host)

} catch (error) {
  console.log(error)
}

console.log('Proxy Server: listening on port ' + port)