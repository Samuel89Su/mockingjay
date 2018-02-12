'use strict';

const cacheKeys = {
    apiInventory: 'apiinventory',
    appInventory: 'appinventory',
    appId: 'appid',
    apiId: 'apiId',
    schemaPostfix: 'schema',
    mockCfgPostfix: 'mockCfg'
}

const keyPrefixes = {
    appIdIncre: 'appid',
    apiIdIncre: 'apiId',
    appInventory: 'appinventory_',
    apiInventory: 'apiinventory:',
}

function CombineCacheKey(cacheType, params) {
    if (!keyPrefixes.hasOwnProperty(cacheType)) {
        return null
    } else {
        let keyPrefix = keyPrefixes[cacheType]
        if (!params) {

        } else if (typeof params !== 'object' && !(params instanceof Array)) {
            keyPrefix += params
        } else if (params instanceof Array) {
            for (let i = 0; i < params.length; i++) {
                let partial = params[i];
                if (partial) {
                    keyPrefix += partial + '_'
                }
            }
        } else if (typeof params === 'object') {
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    const val = params[key];
                    if (val) {
                        keyPrefix += val + '_'
                    }
                }
            }
        } else {
            throw new TypeError('type of params is invalid')
        }

        if (keyPrefix.endsWith('_')) {
            keyPrefix = keyPrefix.subStr(0, keyPrefix.length - 1)
        }
        return keyPrefix
    }
}

exports = module.exports = cacheKeys;