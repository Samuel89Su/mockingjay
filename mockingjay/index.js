'use strict'

const Koa = require('koa')
const logger = require('./src/common/logger')
const preStart = require('./src/preStart')
const config = require('./defaultConfig')

const server = require('./src/server')

preStart()

server.listen(config.port, config.host, (err) => {
    if (err) {
        throw err
    }
    logger.info('listening on ' + config.port)
    console.log('listening on ' + config.port)
})