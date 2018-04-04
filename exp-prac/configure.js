const minimist = require('minimist')
const path = require('path')
const fs = require('fs')
const rfs = require('rotating-file-stream')
const logger = require('morgan')


/**
 * 处理与环境相关的配置
 */

module.exports = function (app) {
    // set app env
    var args = minimist(process.argv.slice(2))
    app.set('env', args.env)

    configureLogger(app, args.env || 'development')

    app.disable('x-powered-by')

    args.env == 'production' && app.set('trust proxy', 1)
}

function configureLogger(app, env) {
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
    env === 'production' || app.use(logger('dev'))
    // setup rotate file logger
    app.use(logger('combined', {
        stream: accessLogStream
    }))
}