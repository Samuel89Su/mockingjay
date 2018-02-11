'use strict';

const Redis = require('redis');
const Promise = require('bluebird');
const cacheKeys = require('./cacheKeys');

Promise.promisifyAll(Redis.RedisClient.prototype);
Promise.promisifyAll(Redis.Multi.prototype);

const redisConOption = {
    host: '127.0.0.1',
    port: '6379',
};

const redisClient = Redis.createClient(redisConOption);

exports = module.exports = redisClient;