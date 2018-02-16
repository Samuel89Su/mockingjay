'use strict'

const crypto = require('crypto')
const MD5 = crypto.createHash('md5')

class CacheKeyCombinator {
    constructor () {

        this.appInventoryPrefix = 'appinventory'
        this.apiInventoryPrefix = 'apiinventory'
        this.schemaPostfix = 'schema'

        this.appIdKey = 'appId'
        this.apiIdKey = 'apiId'

        this.buildAppCfgKey = this.buildAppCfgKey.bind(this)
        this.buildApiDescKey = this.buildApiDescKey.bind(this)
        this.buildApiSchemaKey = this.buildApiSchemaKey.bind(this)
        this.buildMockCfgKey = this.buildMockCfgKey.bind(this)
        this.buildApiKeyPrefix = this.buildApiKeyPrefix.bind(this)
    }

    buildAppCfgKey (appName, id) {
        return `${this.appInventoryPrefix}:${appName.toLowerCase()}_${id}`
    }

    buildApiDescKey (appName, apiId, apiPath) {
        return `${this.buildApiKeyPrefix(appName, false)}${apiId}_${apiPath}`
    }

    buildApiSchemaKey (appName, apiId) {
        return `${this.buildApiKeyPrefix(appName, false)}${apiId}_${this.schemaPostfix}`
    }

    buildMockCfgKey(appName, apiPath) {
        if (!appName || appName === '') {
            throw new Error('appName is undefined or null')
        } else if (!apiPath || apiPath === '') {
            throw new Error('path is undefined or null')
        } else {
            let degist = MD5.update(apiPath.toLowerCase()).digest('hex')
            let key = `${this.buildApiKeyPrefix(appName.toLowerCase(), false)}${degist}`
            console.log(key);
            return key
        }
    }

    /**
     * 
     * @param {String} appName 
     * @param {Boolean} isPattern 
     * @returns {Promise<String>}
     */
    buildApiKeyPrefix(appName, isPattern) {
        return `${this.apiInventoryPrefix}:${appName.toLowerCase()}:${isPattern?'*':''}`
    }

    // combineCacheKey(cacheType, params) {
    //     if (!cacheType) {
    //         throw new Error('cacheType is undefined or null')
    //     } else if (!this.keyPrefixes.hasOwnProperty(cacheType) && !this.keyPostfixes.hasOwnProperty(cacheType)) {
    //         throw new Error('cacheType is not supported')
    //     } else {
    //         let cacheKey = ''
    //         if (params) {
    //             if (typeof params !== 'object' && !(params instanceof Array)) {
    //                 cacheKey += params
    //             } else if (params instanceof Array) {
    //                 for (let i = 0; i < params.length; i++) {
    //                     let partial = params[i]
    //                     if (partial) {
    //                         if (typeof partial === 'string') {
    //                             partial = partial.toLowerCase()
    //                         }
    //                         cacheKey += partial + '_'
    //                     }
    //                 }
    //             } else if (typeof params === 'object' && !(params instanceof Array)) {
    //                 for (const key in params) {
    //                     if (params.hasOwnProperty(key)) {
    //                         let val = params[key]
    //                         if (val) {
    //                             if (typeof val === 'string') {
    //                                 val = val.toLowerCase()
    //                             }
    //                             cacheKey += val + '_'
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 throw new TypeError('type of params is invalid')
    //             }
    //         }    

    //         if (this.keyPrefixes.hasOwnProperty(cacheType)) {
    //             let keyPrefix = this.keyPrefixes[cacheType]
    //             cacheKey = keyPrefix + cacheKey
    //             if (cacheKey.endsWith('_')) {
    //                 cacheKey = cacheKey.substr(0, cacheKey.length - 1)
    //             }
    //         }
    
    //         if (this.keyPostfixes.hasOwnProperty(cacheType)) {            
    //             let keyPostfix = this.keyPostfixes[cacheType]
    //             cacheKey += keyPostfix
    //             if (cacheKey.startsWith('_')) {
    //                 cacheKey = cacheKey.substr(1, cacheKey.length - 1)
    //             }
    //         }
    
    //         return cacheKey
    //     }
    // }
}

exports = module.exports = new CacheKeyCombinator()