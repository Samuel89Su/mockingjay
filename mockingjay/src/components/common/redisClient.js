'use strict'

const Redis = require('redis')
const Promise = require('bluebird')
const cacheKeys = require('./cacheKeys')
const logger = require('./logger')

Promise.promisifyAll(Redis.RedisClient.prototype)
Promise.promisifyAll(Redis.Multi.prototype)

const redisConOption = {
    host: '127.0.0.1',
    port: '6379',
};

const redisClient = Redis.createClient(redisConOption)

// w & r test
// const ok = await redisClient.setAsync('test', 123) === 'OK'
// ok = ok && await redisClient.getAsync('test') === '123'
// logger.error(`redis w & r test ${ok ? 'success' : 'failed'}`)

exports = module.exports = redisClient