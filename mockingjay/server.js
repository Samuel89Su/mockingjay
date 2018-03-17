'use strict'

const Koa = require('koa')
const serve = require('koa-static')
const router = require('./router')
const logger = require('./src/common/logger')
const preStart = require('./src/preStart')
const rename = require('./test/common/CacheFacade.test')
const config = require('./defaultConfig')
const compress = require('./src/Middlewares/Compression')

preStart()

const server = new Koa()
server.env = process.env.NODE_ENV !== 'production' ? 'dev' : 'production'

server.use(compress({
    filter: function(ctx) {
        return /((text\/css)|(application\/javascript))/i.test(ctx.type)
    },
    threshold: 20 * 1024,
    flush: require('zlib').Z_SYNC_FLUSH
}))

server.use(serve(__dirname + '/static', {
    maxage: 12 * 60 * 60 * 1000
}))

server.use(router.routes())
    .use(router.allowedMethods())

server.listen(config.port, config.host, (err) => {
    if (err) {
        throw err
    }
    logger.info('listening on ' + config.port)
    console.log('listening on ' + config.port)
})