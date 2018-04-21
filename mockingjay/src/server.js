'use strict'

const Koa = require('koa')
const serve = require('koa-static')
const path = require('path')
const compress = require('./Middlewares/Compression')

const router = require('./router')

const server = new Koa()
server.env = process.env.NODE_ENV !== 'production' ? 'dev' : 'production'

const cookieSession = require('./Middlewares/session')(server)
server.use(cookieSession)

server.use(compress({
    filter: function(ctx) {
        return /((text\/css)|(application\/javascript))/i.test(ctx.type)
    },
    threshold: 20 * 1024,
    flush: require('zlib').Z_SYNC_FLUSH
}))

server.use(router.routes())
    .use(router.allowedMethods())

server.use(serve(path.resolve(__dirname, '../static'), {
    maxage: 12 * 60 * 60 * 1000
}))

exports = module.exports = server