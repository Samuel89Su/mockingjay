'use strict'

const assert = require('assert')
const CacheFacade = require('../../src/common/CacheFacade')
const redisClient = require('../../src/common/redisClient')
const CacheKeyCombinator = require('../../src/common/CacheKeyCombinator')

async function rename() {
    let appKeys = await CacheFacade.redisFullyScan('appinventory:*_*')
                    .then((temp) => { return temp }, (err) => { throw err })
    if (appKeys.length > 0) {
        for (let i = 0; i < appKeys.length; i++) {
            const key = appKeys[i];
            let id = CacheKeyCombinator.extractAppId(key).toString()
            let newId = id.padStart(4, '0')
            let newKey = key.replace(/\:\d{1,5}_/, ':' + newId + '_')

            await redisClient.renameAsync(key, newKey)
        }
    }

    let apiKeys = await CacheFacade.redisFullyScan('apiinventory:*:*_*')
                    .then((temp) => { return temp }, (err) => { throw err })
    if (apiKeys.length > 0) {
        for (let i = 0; i < apiKeys.length; i++) {
            const key = apiKeys[i];
            let id = CacheKeyCombinator.extractAppId(key).toString()
            let newId = id.padStart(5, '0')
            let newKey = key.replace(/\:\d{1,5}_/, ':' + newId + '_')

            await redisClient.renameAsync(key, newKey)
        }
    }
}

exports = module.exports = rename
