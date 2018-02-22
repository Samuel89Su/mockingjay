'use strict'

const crypto = require('crypto')
// const MD5 = crypto.createHash('md5')

class CacheKeyCombinator {
    constructor () {

        this.appInventoryPrefix = 'appinventory'
        this.apiInventoryPrefix = 'apiinventory'
        this.schemaPostfix = 'schema'
        this.examplePostfix = 'example'

        this.appIdKey = 'appId'
        this.apiIdKey = 'apiId'

        this.buildAppCfgKey = this.buildAppCfgKey.bind(this)
        this.buildApiDescKey = this.buildApiDescKey.bind(this)
        this.buildApiSchemaKey = this.buildApiSchemaKey.bind(this)
        this.buildMockCfgKey = this.buildMockCfgKey.bind(this)
        this.buildApiKeyPrefix = this.buildApiKeyPrefix.bind(this)
        this.buildApiExampleKey = this.buildApiExampleKey.bind(this)

        this.extractAppId = this.extractId.bind(this) 
    }

    /**
     * 
     * @param {String} appName app name
     * @param {Number} id app id
     * @returns {String} cache key
     */
    buildAppCfgKey (appName, id) {
        return `${this.appInventoryPrefix}:${id}_${appName.toLowerCase()}`
    }

    /**
     * 
     * @param {String} appName 
     * @param {Number} apiId 
     * @param {String} apiPath 
     * @returns {String} cache key
     */
    buildApiDescKey (appName, apiId, apiPath) {
        return `${this.buildApiKeyPrefix(appName, false)}${apiId}_${apiPath.toLowerCase()}`
    }

    /**
     * 
     * @param {String} appName app name
     * @param {Number} apiId api id
     * @returns {String} cache key
     */
    buildApiSchemaKey (appName, apiId) {
        return `${this.buildApiKeyPrefix(appName, false)}${apiId}_${this.schemaPostfix}`
    }

    /**
     * 
     * @param {String} appName app name
     * @param {String} apiPath api path
     * @returns {String} cache key
     */
    buildMockCfgKey (appName, apiPath) {
        if (!appName || appName === '') {
            throw new Error('appName is undefined or null')
        } else if (!apiPath || apiPath === '') {
            throw new Error('path is undefined or null')
        } else {
            let degist = crypto.createHash('md5').update(apiPath.toLowerCase()).digest('hex')
            let key = `${this.buildApiKeyPrefix(appName.toLowerCase(), false)}${degist}`
            return key
        }
    }

    /**
     * combine api example cache key
     * @param {String} appName app name
     * @param {Number} apiId api id
     * @returns {String} cache key
     */
    buildApiExampleKey (appName, apiId) {
        return `${this.buildApiKeyPrefix(appName, false)}${apiId}_${this.examplePostfix}`
    }

    /**
     * 
     * @param {String} appName app name
     * @param {Boolean} isPattern use as pattern
     * @returns {String} cache key
     */
    buildApiKeyPrefix (appName, isPattern) {
        return `${this.apiInventoryPrefix}:${appName.toLowerCase()}:${isPattern?'*':''}`
    }

    /**
     * ':[0-9]{1,5}_'
     * @param {String} key cache key
     * @returns {Number} id
     */
    extractId (key) {
        let idPart = key.match(':[0-9]{1,5}_')[0]
        let idRaw = idPart.match('[0-9]{1,5}')[0]
        return parseInt(idRaw)
    }
}

exports = module.exports = new CacheKeyCombinator()