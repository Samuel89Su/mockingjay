'use strict'

const Koa = require('koa')
const serve = require('koa-static')
const router = require('./router')
const logger = require('./src/common/logger')
const redisClient = require('./src/common/redisClient')

// w & r test
async function test () {
    let ok = await redisClient.setAsync('test', 123) === 'OK'
    ok = ok && await redisClient.getAsync('test') === '123'
    logger.error(`redis w & r test ${ok ? 'success' : 'failed'}`)
}

test()

const server = new Koa()
server.env = process.env.NODE_ENV !== 'production' ? 'dev' : 'production'

server.use(serve(__dirname + '/static'))

server.use(router.routes())
    .use(router.allowedMethods())

server.listen(3000, '0.0.0.0', (err) => {
    if (err) {
        throw err
    }
    logger.info('listening on 3000')
    console.log('listening on 3000')
})
