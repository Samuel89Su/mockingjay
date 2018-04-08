'use strict'

const Redis = require('redis')
const Promise = require('bluebird')

Promise.promisifyAll(Redis.RedisClient.prototype)
Promise.promisifyAll(Redis.Multi.prototype)

const redisConOption = require('../../defaultConfig').redisOpts

const redisClient = Redis.createClient(redisConOption)

exports = module.exports = redisClient