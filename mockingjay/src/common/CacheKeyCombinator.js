'use strict'

const KEYPREFIX = 'mk:'

class CacheKeyCombinator {
    constructor () {

        this.appInventoryPrefix = 'appinventory'
        this.apiInventoryPrefix = 'apiinventory'
        this.schemaPostfix = 'schema'
        this.examplePostfix = 'example'

        this.appIdKey = 'appId'
        this.apiIdKey = 'apiId'

        this.usrIdKey = KEYPREFIX + 'usrId'
        this.usrKeyPrefix = KEYPREFIX + 'usr'

        this.buildAppCfgKey = this.buildAppCfgKey.bind(this)
        this.buildApiDescKey = this.buildApiDescKey.bind(this)
        this.buildApiSchemaKey = this.buildApiSchemaKey.bind(this)
        this.buildMockCfgKey = this.buildMockCfgKey.bind(this)
        this.buildApiKeyPrefix = this.buildApiKeyPrefix.bind(this)
        this.buildApiExampleKey = this.buildApiExampleKey.bind(this)

        this.buildUserKey = this.buildUserKey.bind(this)
        this.buildUserAppMapKey = this.buildUserAppMapKey.bind(this)
        this.buildUserAppHashKey = this.buildUserAppHashKey.bind(this)
        this.buildAuthedAppKey = this.buildAuthedAppKey.bind(this)
        this.buildAuthedAppHashKey = this.buildAuthedAppHashKey.bind(this)

        this.extractAppId = this.extractId.bind(this)
    }

    /**
     * 
     * @param {String} appName app name
     * @param {Number} id app id
     * @returns {String} cache key
     */
    buildAppCfgKey (appName, id) {
        if (Number.isInteger(id) || !Number.isNaN(parseInt(id))) {
            id = id.toString().padStart(4, '0')
        }
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
        if (Number.isInteger(apiId) || !Number.isNaN(parseInt(apiId))) {
            apiId = apiId.toString().padStart(5, '0')
        }        
        return `${this.buildApiKeyPrefix(appName, false)}${apiId}_${apiPath.toLowerCase()}`
    }

    /**
     * 
     * @param {String} appName app name
     * @param {Number} apiId api id
     * @returns {String} cache key
     */
    buildApiSchemaKey (appName, apiId) {
        if (Number.isInteger(apiId) || !Number.isNaN(parseInt(apiId))) {
            apiId = apiId.toString().padStart(5, '0')
        }
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
            apiPath = apiPath.toLowerCase()
            let key = `${this.buildApiKeyPrefix(appName.toLowerCase(), false)}${apiPath}`
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
        if (Number.isInteger(apiId) || !Number.isNaN(parseInt(apiId))) {
            apiId = apiId.toString().padStart(5, '0')
        }
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
     * ':\d{1,5}_'
     * @param {String} key cache key
     * @returns {Number} id
     */
    extractId (key) {
        let idPart = key.match(':\d{1,5}_')[0]
        let idRaw = idPart.match('\d{1,5}')[0]
        return parseInt(idRaw)
    }

    /**
     * 
     * @param {String} userName 
     * @param {Number} userId 
     * @returns {String} user key
     */
    buildUserKey (userName, userId) {
        return `${this.usrKeyPrefix}_${(userName || '*')}_${(userId || '*')}`
    }

    /**
     * 构建用户应用列表的key
     * @param {Number} userId
     * @returns {String} user app list key
     */
    buildUserAppMapKey (userId) {
        return `${KEYPREFIX}usrapplst_${userId}`
    }

    /**
     * 构建用户应用列表中的 hashkey
     * @param {String} appName 应用名称
     * @param {Number} appId 应用ID
     * @returns {String} 缓存key
     */
    buildUserAppHashKey (appName, appId) {
        if (appId && Number.isInteger(appId)) {
            appId = appId.toString().padStart(4, '0')
        }
        return `${(appId || '*')}_${(appName || '*')}`
    }

    /**
     * 构建用户授权应用列表的key
     * @param {Number} userId 用户ID
     * @returns {String} cache key
     */
    buildAuthedAppKey (userId) {
        return `${KEYPREFIX}usrauthapplst_${userId}`
    }

    /**
     * 构建用户授权应用列表中的 hashkey
     * @param {Number} userId 用户ID
     * @returns {String} cache key
     */
    buildAuthedAppHashKey (appName, appId) {
        if (appId && Number.isInteger(appId)) {
            appId = appId.toString().padStart(4, '0')
        }
        return `${(appId || '*')}_${(appName || '*')}`
    }
}

exports = module.exports = new CacheKeyCombinator()