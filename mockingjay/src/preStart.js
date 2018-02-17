'use strict'

const logger = require('./common/logger')
const redisClient = require('./common/redisClient')

// w & r test
async function checkRedis () {
    let ok = await redisClient.setAsync('test', 123) === 'OK'
    ok = ok && await redisClient.getAsync('test') === '123'
    logger.error(`redis w & r test ${ok ? 'success' : 'failed'}`)
}

async function preStart () {
    await checkRedis()
}

exports = module.exports = preStart