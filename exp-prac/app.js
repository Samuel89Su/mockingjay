const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs')
const rfs = require('rotating-file-stream')
const minimist = require('minimist');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { port } = require('./config')
const ws = require('./websocket')

// create app
var app = express();

// set app env
var args = minimist(process.argv.slice(2));
app.set('env', args.env)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// setup logging
var logDirectory = path.join(__dirname, 'log')
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})
// setup the dev console logger
args.env === 'production' || app.use(logger('dev'));
// setup rotate file logger
app.use(logger('combined', {stream: accessLogStream}))

// 默认index路由
// app.use('/', indexRouter);
// 自定义路由
// app.use('/users', usersRouter);

// 添加代理中间件
const proxy = require('./proxy')(port)
app.use('/', proxy)

// 静态资源服务
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
