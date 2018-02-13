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

const keyPostfixes = {
    schema: '_schema',
    mockCfg: '_mockCfg'
}

function CombineCacheKey(cacheType, params) {
    if (!params || (!keyPrefixes.hasOwnProperty(cacheType) && !keyPostfixes.hasOwnProperty(cacheType))) {
        return null
    } else {
        let cacheKey = null
        if (typeof params !== 'object' && !(params instanceof Array)) {
            cacheKey += params
        } else if (params instanceof Array) {
            for (let i = 0; i < params.length; i++) {
                let partial = params[i];
                if (partial) {
                    cacheKey += partial + '_'
                }
            }
        } else if (typeof params === 'object') {
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    const val = params[key];
                    if (val) {
                        cacheKey += val + '_'
                    }
                }
            }
        } else {
            throw new TypeError('type of params is invalid')
        }

        if (keyPrefixes.hasOwnProperty(cacheType)) {
            let keyPrefix = keyPrefixes[cacheType]
            cacheKey = keyPrefix + cacheKey

            if (cacheKey.endsWith('_')) {
                cacheKey = keyPrefix.subStr(0, cacheKey.length - 1)
            }
        }

        if (keyPostfixes.hasOwnProperty(cacheType)) {            
            let keyPostfix = keyPrefixes[cacheType]
            cacheKey += keyPostfix

            if (cacheKey.startsWith('_')) {
                cacheKey = cacheKey.subStr(1, cacheKey.length - 1)
            }
        }

        return cacheKey
    }
}

exports = module.exports = cacheKeys;