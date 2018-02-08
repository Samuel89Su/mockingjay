'use strict'

const Koa = require('koa')
const serve = require('koa-static')
const router = require('./router')
const logger = require('./src/components/common/logger')
const Router = require('koa-router')

const server = new Koa()
server.env = process.env.NODE_ENV !== 'production' ? 'dev' : 'production'

server.use(serve(__dirname + '/static'))

server.use(router.routes())
    .use(router.allowedMethods())

server.listen(3000, (err) => {
    if (err) {
        throw err
    }
    logger.info('listening on 3000')
    console.log('listening on 3000')
})