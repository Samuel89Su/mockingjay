'use strict'

const Koa = require('koa')
const serve = require('koa-static')
const router = require('./router')
const logger = require('./src/common/logger')
const preStart = require('./src/preStart')
const rename = require('./test/common/CacheFacade.test')

preStart()

const server = new Koa()
server.env = process.env.NODE_ENV !== 'production' ? 'dev' : 'production'

server.use(serve(__dirname + '/static'), {
    maxage: 12 * 60 * 60 * 1000
})

server.use(router.routes())
    .use(router.allowedMethods())

server.listen(3000, '0.0.0.0', (err) => {
    if (err) {
        throw err
    }
    logger.info('listening on 3000')
    console.log('listening on 3000')
})