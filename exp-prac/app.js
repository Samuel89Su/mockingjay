var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { port } = require('./config')
const ws = require('./websocket')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie parser
app.use(cookieParser());

// 默认index路由
app.use('/', indexRouter);
// 自定义路由
app.use('/users', usersRouter);

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
