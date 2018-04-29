'use strict'

const CacheKeyCombinator = require('./CacheKeyCombinator')
const redisClient = require('./redisClient')
const logger = require('./logger')
const getComparer = require('../utils').getComparer
const assemblePagination = require('./paginatedResult')
const parse = require('../utils').parse

const appAndApiComparer = getComparer()

const pageSize = 10

class CacheFacade {
    constructor() {
        this.getApp = this.getApp.bind(this)
        this.getApp = this.getApp.bind(this)
        this.delApp = this.delApp.bind(this)
        this.checkAppName = this.checkAppName.bind(this)
        this.getApiList = this.getApiList.bind(this)
        this.getApi = this.getApi.bind(this)
        this.delApi = this.delApi.bind(this)
        this.searchAppByPartialName = this.searchAppByPartialName.bind(this)
        this.searchApiByPartialPath = this.searchApiByPartialPath.bind(this)
        this.renameAppAndApiKey = this.renameAppAndApiKey.bind(this)

        this.internalGetApps = this.internalGetApps.bind(this)
        this.internalGetApis = this.internalGetApis.bind(this)

        this.getUser = this.getUser.bind(this)
        this.bindUsrApp = this.bindUsrApp.bind(this)
        this.searchUserByUserName = this.searchUserByUserName.bind(this)
        this.sharedUserOfApp = this.sharedUserOfApp.bind(this)
    }

    /**
     * allocate new app id
     * @returns {Promise<Number>}
     */
    async allocateAppId() {
        let id = await redisClient.incrAsync(CacheKeyCombinator.appIdKey)
        return id
    }

    /**
     * allocate new api id
     * @returns {Promise<Number>}
     */
    async allocateApiId() {
        let id = await redisClient.incrAsync(CacheKeyCombinator.apiIdKey)
        return id
    }

    /**
     * get paginated app, 10 as a page.
     * @param {Number} pageNum page number
     * @returns {Promise<Array>}
     */
    async getAppList(userId, pageNum) {
        if (!pageNum) {
            pageNum = 0
        }

        // get user's app
        let key = CacheKeyCombinator.buildUserAppMapKey(userId)
        let usrApps = await redisClient.hgetallAsync(key)
        let appKeys = Object.keys(usrApps)
        appKeys.sort()
        let total = appKeys.length

        let startIdx = pageNum * pageSize
        appKeys = appKeys.slice(startIdx, startIdx + pageSize)
        let apps = []
        while (appKeys && appKeys.length > 0) {
            let appKey = CacheKeyCombinator.appInventoryPrefix + ':' + appKeys.shift()
            let rawApp = await redisClient.getAsync(appKey)
            apps.push(JSON.parse(rawApp))
        }

        let page = assemblePagination(pageNum, pageSize, total, apps)

        return page
    }

    /**
     * search app by partial name
     * @param {String} partialName partial app name
     * @param {Number} pageNum page num
     * @returns {Promise<Object>} { pageNum: {Number}, pageSize: {Number}, total: {Number}, pageCnt: {Number}, records: {Array<Object>} }
     */
    async searchAppByPartialName(userId, partialName, pageNum, isGranted) {
        if (typeof partialName !== 'string' || !partialName) {
            throw new Error('invalid arguments')
        }
        if (!pageNum) {
            pageNum = 0
        }

        let key = isGranted ? CacheKeyCombinator.buildAuthedAppKey(userId) : CacheKeyCombinator.buildUserAppMapKey(userId)
        let keyPattern = CacheKeyCombinator.buildUserAppHashKey(`*${partialName}*`, 0)

        let page = await this.internalGetApps(key, keyPattern, pageNum)

        return page
    }

    async internalGetApps(key, hashKeyPattern, pageNum) {
        let keys = await this.redisFullyHScan(key, hashKeyPattern)

        let total = keys.length

        keys = keys.sort(appAndApiComparer)
        let startIdx = pageNum * pageSize
        keys = keys.slice(startIdx, startIdx + pageSize)

        let apps = []

        for (let i = 0; i < keys.length; i++) {
            const hashKey = keys[i]
            let appKey = `${CacheKeyCombinator.appInventoryPrefix}:${hashKey}`
            let appDesc = await redisClient.getAsync(appKey)
            apps.push(JSON.parse(appDesc))
        }

        let page = assemblePagination(pageNum, pageSize, total, apps)

        return page
    }

    /**
     * get app desc by name, id, or both.
     * @param {String} name
     * @param {Number} id
     * @returns {Promise<Object>}
     */
    async getApp(name, id) {
        if ((typeof name !== 'string' || !name) && !Number.isInteger(id)) {
            throw new Error('invalid arguments')
        }

        let key = null
        // exact
        if (typeof name === 'string' && name && Number.isInteger(id) && id > 0) {
            key = CacheKeyCombinator.buildAppCfgKey(name, id)
        } else {
            if (typeof name === 'string' && name) {
                id = '*'
            } else if (Number.isInteger(id) && id > 0) {
                name = '*'
            } else {
                throw new Error('invalid arguments')
            }

            let keyPattern = CacheKeyCombinator.buildAppCfgKey(name, id)

            key = await this.scanFirst(keyPattern)
        }

        if (key) {
            let appDescRaw = await redisClient.getAsync(key)
            if (appDescRaw) {
                let appDesc = JSON.parse(appDescRaw)
                return appDesc
            }
        }

        return null
    }

    /**
     * set app desc by name and id.
     * @param {String} name
     * @param {Number} id
     * @returns {Promise<Boolean>}
     */
    async setApp(name, id, appDesc) {
        if (typeof name !== 'string' || !name || !Number.isInteger(id) || id < 1 ||
            typeof appDesc !== 'object' || !appDesc) {
            throw new Error('invalid arguments')
        }

        let key = CacheKeyCombinator.buildAppCfgKey(name, id)
        let ok = await redisClient.setAsync(key, JSON.stringify(appDesc)) === 'OK'
        return ok
    }

    /**
     * 添加用户应用
     * @param {Number} userId 用户ID
     * @param {String} appName app名称
     * @param {Number} appId app ID
     * @param {Array<Number>} shareList 分享用户列表
     * @returns {Promise<Boolean>}
     */
    async bindUsrApp(userId, appName, appId, shareList) {
        if (!userId) {
            throw new Error('invalid userId')
        } else if (!appName || !appId) {
            throw new Error('invalid appName or appId')
        }

        let key = CacheKeyCombinator.buildUserAppMapKey(userId)
        let hashKey = CacheKeyCombinator.buildUserAppHashKey(appName, appId)
        let ok = await redisClient.hsetAsync(key, hashKey, JSON.stringify(shareList || [])) === 1
        return ok
    }

    /**
     * 用户授权
     * @param {Number} userId 用户ID
     * @param {String} appName app名称
     * @param {Number} appId app ID
     * @param {Array<Number>} shareList 分享用户列表
     * @returns {Promise<Boolean>}
     */
    async grantAppToUsers(userId, appName, appId, shareList) {
        if (!shareList || shareList.length === 0) {
            throw new Error('invalid shareList')
        }
        if (!userId) {
            throw new Error('invalid userId')
        } else if (!appName || !appId) {
            throw new Error('invalid appName or appId')
        }

        let key = CacheKeyCombinator.buildUserAppMapKey(userId)
        let hashKey = CacheKeyCombinator.buildUserAppHashKey(appName, appId)
        let rawShareLst = await redisClient.hgetAsync(key, hashKey)
        let oldShareLst = []
        if (rawShareLst) {
            oldShareLst = JSON.parse(rawShareLst)
            for (let i = 0; i < shareList.length; i++) {
                let authedUser = shareList[i];
                if (oldShareLst.indexOf(authedUser.id) === -1) {
                    oldShareLst.push(authedUser.id)
                }
            }
        }
        // update user app share list
        let ok = await redisClient.hsetAsync(key, hashKey, JSON.stringify(oldShareLst))

        // update user authed app list
        // if (!!ok) {
            for (let j = 0; j < shareList.length; j++) {
                let authedUser = shareList[j];

                let key = CacheKeyCombinator.buildAuthedAppKey(authedUser.id)
                let hashKey = CacheKeyCombinator.buildAuthedAppHashKey(appName, appId)
                ok &= await redisClient.hsetAsync(key, hashKey, '{}')
            }
        // }

        return true
    }

    /**
     * delete app and all api
     * @param {String} name 
     * @param {Number} id
     * @returns {Promise<Boolean>} 
     */
    async delApp(name, id) {
        if (typeof name !== 'string' && !Number.isInteger(id)) {
            throw new Error('invalid arguments')
        }

        let key = null
        // exact
        if (typeof name === 'string' && name && Number.isInteger(id) && id > 0) {
            key = CacheKeyCombinator.buildAppCfgKey(name, id)
        } else {
            if (typeof name === 'string' && name) {
                id = '*'
            } else if (Number.isInteger(id) && id > 0) {
                name = '*'
            } else {
                throw new Error('invalid arguments')
            }

            let keyPattern = CacheKeyCombinator.buildAppCfgKey(name, id)

            key = await this.scanFirst(keyPattern)
        }

        if (key) {
            let ok = await redisClient.delAsync(key) > 0
            if (!ok) {
                return ok
            }

            let appSubPattern = CacheKeyCombinator.buildApiKeyPrefix(name, true)
            let keys = await this.redisFullyScan(appSubPattern)
            if (keys && keys.length > 0) {
                let joinedKey = ''
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    joinedKey += key + ' '
                }

                ok &= await redisClient.delAsync(key) === keys.length
            }

            return ok
        }

        return false
    }

    /**
     * check is app registered, return true if registered, otherwise return false.
     * @param {String} name
     * @returns {Promise<Boolean>}
     */
    async checkAppName(name) {
        if (typeof name !== 'string' || !name) {
            throw new Error('invalid name')
        }

        let keyPattern = CacheKeyCombinator.buildAppCfgKey(name, '*')
        let key = await this.scanFirst(keyPattern)
        if (key) {
            return true
        } else {
            return false
        }
    }

    /**
     * get api list by app name.
     * @param {String} appName
     * @param {Number} pageNum
     * @returns {Promise<Array<Object>>}
     */
    async getApiList(appName, pageNum) {
        if (typeof appName !== 'string' || !appName) {
            throw new Error('invalid appName')
        }

        if (!pageNum) {
            pageNum = 0
        }

        let keyPattern = CacheKeyCombinator.buildApiDescKey(appName, '*', '/*')

        let page = await this.internalGetApis(keyPattern, pageNum)

        return page
    }

    /**
     * get api list by app name.
     * @param {String} appName
     * @param {Number} pageNum
     * @returns {Promise<Array<Object>>}
     */
    async searchApiByPartialPath(appName, partialPath, pageNum) {
        if (typeof appName !== 'string' || !appName || typeof partialPath !== 'string' || !partialPath) {
            throw new Error('invalid appName')
        }

        if (!pageNum) {
            pageNum = 0
        }

        let keyPattern = CacheKeyCombinator.buildApiDescKey(appName, '*', '/*' + partialPath + '*')

        let page = await this.internalGetApis(keyPattern, pageNum)

        return page
    }

    async internalGetApis(keyPattern, pageNum) {
        let keys = await this.redisFullyScan(keyPattern)
        let total = keys.length

        keys = keys.sort(appAndApiComparer)
        let startIdx = pageNum * pageSize
        keys = keys.slice(startIdx, startIdx + pageSize)

        let apis = []
        if (keys && keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                let apiDesc = await redisClient.getAsync(key)
                apis.push(JSON.parse(apiDesc))
            }
        }

        let page = assemblePagination(pageNum, pageSize, total, apis)

        return page
    }

    /**
     * get api desc by app name, id and api path (or one of them).
     * @param {String} appName
     * @param {Number} id, api id
     * @param {String} apiPath
     * @returns {Promise<Object>}
     */
    async getApi(appName, id, apiPath) {
        if (typeof appName !== 'string' || !appName) {
            throw new Error('invalid appName')
        }
        if ((!Number.isInteger(id) || id < 1) && (typeof apiPath !== 'string' || !apiPath)) {
            throw new Error('invalid id or apiPath')
        }

        let key = null
        // exact
        if (typeof apiPath === 'string' && apiPath && Number.isInteger(id) && id > 0) {
            key = CacheKeyCombinator.buildApiDescKey(appName, id, apiPath)
        } else {
            if (typeof apiPath === 'string' && apiPath) {
                id = '*'
            } else if (Number.isInteger(id) && id > 0) {
                apiPath = '/*'
            } else {
                throw new Error('invalid arguments')
            }

            let keyPattern = CacheKeyCombinator.buildApiDescKey(appName, id, apiPath)

            key = await this.scanFirst(keyPattern)
        }

        if (key) {
            let apiDescRaw = await redisClient.getAsync(key)
            if (apiDescRaw) {
                let appDesc = JSON.parse(apiDescRaw)
                return appDesc
            }
        }

        return null
    }

    /**
     * set api by app name, api id and api path
     * @param {*} appName 
     * @param {*} id 
     * @param {*} apiPath 
     * @returns {Promise<Boolean>}
     */
    async setApi(appName, id, apiPath, apiDesc) {
        if (typeof appName !== 'string' || !appName || !Number.isInteger(id) || id < 1 ||
            typeof apiPath !== 'string' || !apiPath || typeof apiDesc !== 'object' || !apiDesc) {
            throw new Error('invalid arguments')
        }

        let key = CacheKeyCombinator.buildApiDescKey(appName, id, apiPath)
        let ok = await redisClient.setAsync(key, JSON.stringify(apiDesc)) === 'OK'
        return ok
    }

    /**
     * del api desc by app name, id and api path (or one of them).
     * @param {String} appName
     * @param {Number} id, api id
     * @param {String} apiPath
     * @returns {Promise<Boolean>}
     */
    async delApi(appName, id, apiPath) {
        if (typeof appName !== 'string' || !appName) {
            throw new Error('invalid appName')
        }
        if ((!Number.isInteger(id) || id < 1) && (typeof apiPath !== 'string' || !apiPath)) {
            throw new Error('invalid id or apiPath')
        }

        let key = null
        // exact
        if (typeof apiPath === 'string' && apiPath && Number.isInteger(id) && id > 0) {
            key = CacheKeyCombinator.buildApiDescKey(appName, id, apiPath)
        } else {
            if (typeof apiPath === 'string' && apiPath) {
                id = '*'
            } else if (Number.isInteger(id) && id > 0) {
                apiPath = '/*'
            } else {
                throw new Error('invalid arguments')
            }

            let keyPattern = CacheKeyCombinator.buildApiDescKey(appName, id, apiPath)

            key = await this.scanFirst(keyPattern)
        }

        if (key) {
            let apiRaw = await redisClient.getAsync(key)
            if (!apiRaw) {
                return false
            }

            // delete api
            let api = JSON.parse(apiRaw)
            let ok = await redisClient.delAsync(key) > 0
            if (!ok) {
                return ok
            }

            // delete schema, mock config & example
            let schemaKey = CacheKeyCombinator.buildApiSchemaKey(appName, id)
            let mockCfgKey = CacheKeyCombinator.buildMockCfgKey(appName, api.path)
            let exampleKey = CacheKeyCombinator.buildApiExampleKey(appName, id)
            ok &= await redisClient.delAsync(schemaKey + ' ' + mockCfgKey + '' + exampleKey) > 0
            return ok
        }

        return false
    }

    /**
     * delete api schema by app name and api id
     * @param {String} appName 
     * @param {Number} id 
     */
    async delApiSchema(appName, id) {
        if (typeof appName !== 'string' || !appName || !Number.isInteger(id) || id < 1) {
            throw new Error('invalid appName or id')
        }

        let schemaKey = CacheKeyCombinator.buildApiSchemaKey(appName, id)
        let ok = await redisClient.delAsync(schemaKey) > 0

        return ok
    }

    /**
     * delete api mock config by app name and api path
     * @param {String} appName 
     * @param {String} apiPath 
     */
    async delApiMockCfg(appName, apiPath) {
        if (typeof appName !== 'string' || !appName || typeof apiPath !== 'string' || !apiPath) {
            throw new Error('invalid appName or apiPath')
        }

        let mockCfgKey = CacheKeyCombinator.buildMockCfgKey(appName, apiPath)
        let ok = await redisClient.delAsync(mockCfgKey) > 0

        return ok
    }

    /**
     * get api schema by app name and api id
     * @param {String} appName
     * @param {Number} id
     * @returns {Promise<Object>}
     */
    async getApiSchema(appName, id) {
        if (typeof appName !== 'string' || !appName || !Number.isInteger(id) || id < 1) {
            throw new Error('invalid appName or id')
        }

        let key = CacheKeyCombinator.buildApiSchemaKey(appName, id)
        let apiSchemaRaw = await redisClient.getAsync(key)
        if (apiSchemaRaw) {
            let apiSchema = parse(apiSchemaRaw)
            return apiSchema
        } else {
            return null
        }
    }

    /**
     * set api schema by app name and api id
     * @param {String} appName
     * @param {Number} id
     * @returns {Promise<Object>}
     */
    async setApiSchema(appName, id, schema) {
        if (typeof appName !== 'string' || !appName || !Number.isInteger(id) || id < 1 || typeof schema !== 'object' || !schema) {
            throw new Error('invalid appName or id')
        }

        let key = CacheKeyCombinator.buildApiSchemaKey(appName, id)
        let ok = await redisClient.setAsync(key, JSON.stringify(schema)) === 'OK'
        return ok
    }

    /**
     * get api mock config by app name and api path.
     * @param {String} appName
     * @param {String} apiPath
     * @returns {Promise<Object>}
     */
    async getApiMockCfg(appName, apiPath) {
        if (typeof appName !== 'string' || !appName || typeof apiPath !== 'string' || !apiPath) {
            throw new Error('invalid appName or apiPath')
        }

        let key = CacheKeyCombinator.buildMockCfgKey(appName, apiPath)
        let mockCfgRaw = await redisClient.getAsync(key)
        if (mockCfgRaw) {
            let mockCfg = JSON.parse(mockCfgRaw)
            return mockCfg
        } else {
            return null
        }
    }

    /**
     * set api mock config by app name and api path.
     * @param {String} appName
     * @param {String} apiPath
     * @param {Object} mockCfg
     * @returns {Promise<Boolean>}
     */
    async setApiMockCfg(appName, apiPath, mockCfg) {
        if (typeof appName !== 'string' || !appName || typeof apiPath !== 'string' || !apiPath ||
            typeof mockCfg !== 'object' || !mockCfg) {
            throw new Error('invalid appName or apiPath')
        }

        let key = CacheKeyCombinator.buildMockCfgKey(appName, apiPath)
        let ok = await redisClient.setAsync(key, JSON.stringify(mockCfg)) === 'OK'
        return ok
    }

    /**
     * get api example
     * @param {String} appName app name
     * @param {Number} id api id
     * @returns {Promise<Object>} api example
     */
    async getApiExample(appName, id) {
        if (typeof appName !== 'string' || !appName || !Number.isInteger(id) || id < 1) {
            throw new Error('invalid appName or id')
        }

        let key = CacheKeyCombinator.buildApiExampleKey(appName, id)
        let apiExampleRaw = await redisClient.getAsync(key)
        if (apiExampleRaw) {
            let apiExample = parse(apiExampleRaw)
            return apiExample
        } else {
            return null
        }
    }

    /**
     * 
     * @param {String} appName app name
     * @param {Number} id api id
     * @param {Object} example apip example
     * @returns {Promise<Boolean>} success
     */
    async setApiExample(appName, id, example) {
        if (typeof appName !== 'string' || !appName || !Number.isInteger(id) || id < 1 || typeof example !== 'object' || !example) {
            throw new Error('invalid appName or id')
        }

        let key = CacheKeyCombinator.buildApiExampleKey(appName, id)
        let ok = await redisClient.setAsync(key, JSON.stringify(example)) === 'OK'
        return ok
    }

    /**
     * rename redis cache key
     * @param {String} appName app name
     * @param {String} id api id
     * @param {String} oldPath old path
     * @param {String} newPath new path
     * @returns {Promise<Boolean>} true if success
     */
    async renameApiCacheKey(appName, id, oldPath, newPath) {
        let oldKey = CacheKeyCombinator.buildApiDescKey(appName, id, oldPath)
        let newKey = CacheKeyCombinator.buildApiDescKey(appName, id, newPath)
        let ok = await redisClient.renameAsync(oldKey, newKey) === 'OK'
        return ok
    }

    async renameApiMockCacheKey(appName, oldPath, newPath) {
        let oldKey = CacheKeyCombinator.buildMockCfgKey(appName, oldPath)
        let newKey = CacheKeyCombinator.buildMockCfgKey(appName, newPath)
        let ok = await redisClient.renameAsync(oldKey, newKey) === 'OK'
        return ok
    }

    /**
     * fully scan in redis by key pattern
     * @param {String} pattern key pattern
     * @returns {Promise<Array<String>>} keys
     */
    async redisFullyScan(pattern) {
        if (!pattern || pattern === ' ') {
            throw new Error('invalid pattern')
        }

        try {
            let keys = []
            let cursor = 0
            do {
                let tempR = await redisClient.scanAsync(cursor, 'MATCH', pattern, 'COUNT', 200)
                if (tempR && tempR instanceof Array && tempR.length > 1) {
                    cursor = parseInt(tempR[0])
                    keys = keys.concat(tempR[1])
                }
            } while (cursor > 0)
            return keys
        } catch (error) {
            throw error
        }
    }

    /**
     * fully hash scan in redis by key pattern
     * @param {String} key
     * @param {String} hashKeyPattern hash key pattern
     * @returns {Promise<Array<String>>} hash keys
     */
    async redisFullyHScan(key, hashKeyPattern) {
        if (!key || key === ' ' || !hashKeyPattern || hashKeyPattern === ' ') {
            throw new Error('invalid pattern')
        }

        try {
            let keys = []
            let cursor = 0
            do {
                let tempR = await redisClient.hscanAsync(key, cursor, 'MATCH', hashKeyPattern, 'COUNT', 200)
                if (tempR && tempR instanceof Array && tempR.length > 1) {
                    cursor = parseInt(tempR[0])
                    if (tempR[1] && tempR[1] instanceof Array && tempR[1].length > 0) {
                        for (let i = 0; i < tempR[1].length; i++) {
                            if (i % 2 != 1) {
                                const hashKey = tempR[1][i]
                                keys.push(hashKey)
                            }
                        }
                    }
                }
            } while (cursor > 0)
            return keys
        } catch (error) {
            throw error
        }
    }

    /**
     * get first key by pattern
     * @param {String} pattern key pattern
     * @returns {Promise<String>} first key
     */
    async scanFirst(pattern) {
        if (!pattern || pattern === ' ') {
            throw new Error('invalid pattern')
        }

        try {
            let keys = []
            let cursor = 0
            do {
                let tempR = await redisClient.scanAsync(cursor, 'MATCH', pattern, 'COUNT', 200)
                if (tempR && tempR instanceof Array && tempR.length > 1) {
                    cursor = parseInt(tempR[0])
                    keys = keys.concat(tempR[1])
                }
            } while (cursor > 0 && keys.length === 0)

            if (keys.length > 0) {
                return keys[0]
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async renameAppAndApiKey() {
        let appKeyPattern = CacheKeyCombinator.appInventoryPrefix + ':*_*'
        let appKeys = await this.redisFullyScan(appKeyPattern)
        for (let i = 0; i < appKeys.length; i++) {
            let appKey = appKeys[i]
            let appId = appKey.substr(13, appKey.indexOf('_') - 13)
            if (appId.length < 4) {
                let newAppId = appId.padStart(4, '0')
                let newKey = appKey.replace(':' + appId + '_', ':' + newAppId + '_')
                await redisClient.renameAsync(appKey, newKey)
            }
        }

        let apiKeyPattern = CacheKeyCombinator.apiInventoryPrefix + ':*:*_*'
        let apiKeys = await this.redisFullyScan(apiKeyPattern)
        for (let i = 0; i < apiKeys.length; i++) {
            let apiKey = apiKeys[i]
            let startIdx = apiKey.lastIndexOf(':') + 1
            let len = apiKey.indexOf('_') - startIdx
            let apiId = apiKey.substr(startIdx, len)
            if (apiId.length < 5) {
                let newApiId = apiId.padStart(5, '0')
                let newKey = apiKey.replace(':' + apiId + '_', ':' + newApiId + '_')
                await redisClient.renameAsync(apiKey, newKey)
            }
        }

    }

    /**
     * allocate new user id
     * @returns {Promise<Number>}
     */
    async allocateUsrId() {
        let id = await redisClient.incrAsync(CacheKeyCombinator.usrIdKey)
        return id
    }

    /**
     * set user
     * @param {Object} user 
     * @returns {Promise<Boolean>} Success
     */
    async setUser(user) {
        if (!user || user === {}) {
            throw new Error('invalid user entity')
        }

        if (!user.name && !Number.isInteger(user.id)) {
            throw new Error('invalid userName or userId')
        }

        if (!user.id) {
            user.id = await this.allocateUsrId()
        }

        let key = CacheKeyCombinator.buildUserKey(user.name, user.id)
        let ok = await redisClient.setAsync(key, JSON.stringify(user)) === 'OK'
        return ok
    }

    /**
     * get user from cache
     * @param {String} userName 
     * @param {Number} userId 
     * @returns {Promise<Object>} user entity
     */
    async getUser(userName, userId) {
        if (!userName && !Number.isInteger(userId)) {
            throw new Error('invalid userName or userId')
        }

        let key = CacheKeyCombinator.buildUserKey(userName, userId)
        if (!userName || !userId) {
            key = await this.scanFirst(key)
        }

        if (!key) {
            return null
        } else {
            let raw = await redisClient.getAsync(key)
            if (raw) {
                return JSON.parse(raw)
            }
        }
    }

    /**
     * 分页获取授权应用列表
     * @param {Number} userId 用户ID
     * @param {Number} pageNum 
     * @returns {Array<Object>} 应用列表
     */
    async getAuthedAppList(userId, pageNum) {
        if (!pageNum) {
            pageNum = 0
        }

        // get user's app
        let key = CacheKeyCombinator.buildAuthedAppKey(userId)
        let usrApps = await redisClient.hgetallAsync(key)
        let page = null
        if (usrApps) {
            let appKeys = Object.keys(usrApps)
            appKeys.sort()
            let total = appKeys.length

            let startIdx = pageNum * pageSize
            appKeys = appKeys.slice(startIdx, startIdx + pageSize)
            let apps = []
            while (appKeys && appKeys.length > 0) {
                let appKey = CacheKeyCombinator.appInventoryPrefix + ':' + appKeys.shift()
                let rawApp = await redisClient.getAsync(appKey)
                apps.push(JSON.parse(rawApp))
            }

            page = assemblePagination(pageNum, pageSize, total, apps)
        }

        return page
    }

    /**
     * get user from cache
     * @param {String} userName 
     * @param {Number} userId 
     * @returns {Promise<Object>} user entity
     */
    async searchUserByUserName(userName) {
        if (!userName) {
            throw new Error('invalid userName')
        }

        userName = `*${userName}*`
        let keyPattern = CacheKeyCombinator.buildUserKey(userName, 0)
        if (!keyPattern) {
            return []
        }

        var keys = await this.redisFullyScan(keyPattern)

        let result = []
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let raw = await redisClient.getAsync(key)
            if (raw) {
                let user = JSON.parse(raw)
                delete user.psw
                result.push(user)
            }
        }
        return result
    }

    /**
     * 
     * @param {Number} userId user id
     * @param {Number} appId app ID
     * @param {String} appName app name
     * @returns {Promise<Array<Object>>} user list
     */
    async sharedUserOfApp(userId, appId, appName) {
        if (!userId || !appId || !appName) {
            throw new Error('invalid userId, appId or appName')
        }
        let key = CacheKeyCombinator.buildUserAppMapKey(userId)
        let hashKey = CacheKeyCombinator.buildUserAppHashKey(appName, appId)
        let rawUserIds = await redisClient.hgetAsync(key, hashKey)
        let userIds = []
        if (!!rawUserIds) {
            userIds = JSON.parse(rawUserIds)
        }
        if (!userIds || userIds.length === 0) {
            return []
        }
        let users = []
        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            var user = await this.getUser(null, userId)
            if (!!user) {
                delete user.psw
                users.push(user)
            }
        }
        return users
    }
}

exports = module.exports = new CacheFacade()