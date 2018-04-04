const createError = require('http-errors')
const express = require('express')
const path = require('path')
const router = require('./router')
const configure = require('./configure')

const { port } = require('./config')
const ws = require('./websocket')

const session = require('./cookieSession')

// create app
var app = express()

// 执行环境差异性配置
configure(app)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

 
app.use([session])

// config router
app.use('/', router)

// 添加代理中间件
const proxy = require('./proxy')(port)
app.use('/', proxy)

// 静态资源服务
app.use(express.static(path.join(__dirname, 'public')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
