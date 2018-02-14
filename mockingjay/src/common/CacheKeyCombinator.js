'use strict'

class CacheKeyCombinator {
    constructor () {
        this.keyPrefixes = {
            appId: 'appid',
            apiId: 'apiId',
            appDesc: 'appinventory:',
            apiDesc: 'apiinventory:'
        }
        this.keyPrefixes.schema = this.keyPrefixes.mockCfg = this.keyPrefixes.apiDesc

        this.keyPostfixes = {
            schema: '_schema',
            mockCfg: '_mockCfg'
        }

        this.combineCacheKey = this.combineCacheKey.bind(this)
    }

    combineCacheKey(cacheType, params) {
        if (!cacheType) {
            throw new Error('cacheType is undefined or null')
        } else if (!this.keyPrefixes.hasOwnProperty(cacheType) && !this.keyPostfixes.hasOwnProperty(cacheType)) {
            throw new Error('cacheType is not supported')
        } else {
            let cacheKey = ''
            if (params) {
                if (typeof params !== 'object' && !(params instanceof Array)) {
                    cacheKey += params
                } else if (params instanceof Array) {
                    for (let i = 0; i < params.length; i++) {
                        let partial = params[i]
                        if (partial) {
                            cacheKey += partial + '_'
                        }
                    }
                } else if (typeof params === 'object' && !(params instanceof Array)) {
                    for (const key in params) {
                        if (params.hasOwnProperty(key)) {
                            const val = params[key]
                            if (val) {
                                cacheKey += val + '_'
                            }
                        }
                    }
                } else {
                    throw new TypeError('type of params is invalid')
                }
            }    

            if (this.keyPrefixes.hasOwnProperty(cacheType)) {
                let keyPrefix = this.keyPrefixes[cacheType]
                cacheKey = keyPrefix + cacheKey
                if (cacheKey.endsWith('_')) {
                    cacheKey = cacheKey.substr(0, cacheKey.length - 1)
                }
            }
    
            if (this.keyPostfixes.hasOwnProperty(cacheType)) {            
                let keyPostfix = this.keyPostfixes[cacheType]
                cacheKey += keyPostfix
                if (cacheKey.startsWith('_')) {
                    cacheKey = cacheKey.substr(1, cacheKey.length - 1)
                }
            }
    
            return cacheKey
        }
    }
}

exports = module.exports = new CacheKeyCombinator()