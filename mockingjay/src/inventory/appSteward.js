'use strict'

const Router = require('koa-router')
const Ajv = require('ajv')
const queryString = require('query-string')
const logger = require('../common/logger')
const errCode = require('./errCode')
const bodyParser = require('../common/bodyParser')
const appSchema = require('../Schemas/appSchema')
const schemaRaker = require('../utils').rake
const CacheFacade = require('../common/CacheFacade')
const getComparer = require('../utils').getComparer
const {
    URL
} = require('url')
const CacheKeyCombinator = require('../common/CacheKeyCombinator')

const appComparer = getComparer('id')

const ajv = new Ajv()
const validate = ajv.compile(appSchema)

class steward {
    constructor(arg) {
        this.list = this.list.bind(this)
        this.listGrantedApp = this.listGrantedApp.bind(this)
        this.get = this.get.bind(this)
        this.register = this.register.bind(this)
        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.cahceKeyLenCheck = this.cahceKeyLenCheck.bind(this)
        this.importPostmanCollection = this.importPostmanCollection.bind(this)
        this.recursivePostmanItem = this.recursivePostmanItem.bind(this)
        this.grantUser = this.grantUser.bind(this)
        this.bindRoutes = this.bindRoutes.bind(this)
    }

    bindRoutes(router, prefixPath) {
        prefixPath = prefixPath || ''

        router.use(prefixPath + '/*', bodyParser)

        router.get([prefixPath + '/', prefixPath + '/echo'], (ctx, next) => {
            ctx.response.body = 'you are in app inventory now.'
        })
        router.get(prefixPath + '/list', this.list)
        router.get(prefixPath + '/listgrantedapp', this.listGrantedApp)
        router.get(prefixPath + '/get', this.get)
        router.post(prefixPath + '/register', this.register)
        router.post(prefixPath + '/update', this.update)
        router.post(prefixPath + '/discard', this.discard)
        // router.post('/cahceKeyLenCheck', this.cahceKeyLenCheck)
        router.post(prefixPath + '/importPostmanCollection', this.importPostmanCollection)
        router.post(prefixPath + '/grantUser', this.grantUser)
        router.post(prefixPath + '/getappuserlist', this.getUserListOfApp)
    }

    /**
     * fetch app list
     * @param {Object} ctx
     *   - {Object} request
     *      - {Object} query - {Number} pageNum default 0
     */
    async list(ctx, next) {
        let pageNum = 0
        let partialname = ''
        if (ctx.query) {
            for (const key in ctx.query) {
                let lowercaseKey = key.toLowerCase()
                let value = ctx.query[key]
                if (lowercaseKey === 'pagenum') {
                    pageNum = parseInt(value)
                } else if (lowercaseKey === 'partialname') {
                    partialname = value
                }
            }
        }

        let page = null
        if (partialname) {
            page = await CacheFacade.searchAppByPartialName(ctx.session.userId, partialname, pageNum, 0)
        } else {
            page = await CacheFacade.getAppList(ctx.session.userId, pageNum)
        }

        ctx.response.body = errCode.success(page)
        await next()
    }

    async listGrantedApp(ctx, next) {
        let pageNum = 0
        let partialname = ''
        if (ctx.query) {
            for (const key in ctx.query) {
                let lowercaseKey = key.toLowerCase()
                let value = ctx.query[key]
                if (lowercaseKey === 'pagenum') {
                    pageNum = parseInt(value)
                } else if (lowercaseKey === 'partialname') {
                    partialname = value
                }
            }
        }

        let page = null
        if (partialname) {
            page = await CacheFacade.searchAppByPartialName(ctx.session.userId, partialname, pageNum, 1)
        } else {
            page = await CacheFacade.getAuthedAppList(ctx.session.userId, pageNum)
        }

        ctx.response.body = errCode.success(page)
        await next()
    }

    /**
     * fetch app cfg by id
     */
    async get(ctx, next) {
        let id = ctx.request.query.appId
        if (!id) {
            ctx.response.status = 400
            ctx.response.body = 'app id CAN NOT be null or empty'
        } else {
            let appCfg = await CacheFacade.getApp('', parseInt(id))

            ctx.response.body = errCode.success(appCfg)
        }

        await next()
    }

    /**
     * register app 
     */
    async register(ctx, next) {
        let appDesc = ctx.request.body

        // validate body json schema
        if (!validate(appDesc)) {
            ctx.response.status = 400
            ctx.response.body = validate.errors
        } else {
            // rake json
            appDesc = schemaRaker(appDesc, appSchema)

            // generate id
            let id = await CacheFacade.allocateAppId()
            appDesc.id = id

            // set/update cache
            let ok = await CacheFacade.setApp(appDesc.name, id, appDesc)
            if (ok) {
                //  绑定用户
                await CacheFacade.bindUsrApp(ctx.session.userId, appDesc.name, id)

                appDesc.id = id
                ctx.response.body = errCode.success(appDesc)
            } else {
                ctx.response.body = errCode.dbErr()
            }
        }

        await next()
    }

    /**
     * update app desc
     */
    async update(ctx, next) {
        let appDesc = ctx.request.body

        // validate body json schema
        if (!validate(appDesc)) {
            ctx.response.status = 400
            ctx.response.body = validate.errors
        } else if (!appDesc.id) {
            ctx.response.status = 400
            ctx.response.body = 'app id CAN NOT be null or empty'
        } else {
            // rake json
            appDesc = schemaRaker(appDesc, appSchema)

            // set/update cache
            let ok = await CacheFacade.setApp(appDesc.name, appDesc.id, appDesc)
            if (ok) {
                ctx.response.body = errCode.success(appDesc)
            } else {
                ctx.response.body = errCode.dbErr()
            }
        }

        await next()
    }

    async discard(ctx, next) {
        let appDesc = ctx.request.body

        // validate body json schema
        if (!validate(appDesc)) {
            ctx.response.status = 400
            ctx.response.body = validate.errors
        } else if (!appDesc.id) {
            ctx.response.status = 400
            ctx.response.body = 'app id CAN NOT be null or empty'
        } else {
            let ok = await CacheFacade.delApp(appDesc.name, appDesc.id)

            ctx.response.body = errCode.success(ok)
        }

        await next()
    }

    async cahceKeyLenCheck(ctx, next) {
        await CacheFacade.renameAppAndApiKey()
        ctx.response.body = errCode.success('ok')
        await next()
    }

    /**
     * 导入 postman collection
     * @param {Object} ctx 
     * @param {Function} next 
     */
    async importPostmanCollection(ctx, next) {
        let collection = ctx.request.body
        // check name as app name
        let appName = collection.info.name
        let app = await CacheFacade.getApp(appName)
        let ok = true
        let appId = 0
        if (!app) {
            appId = await CacheFacade.allocateAppId()
            let appDesc = {
                id: appId,
                name: appName,
                desc: collection.info.description
            }
            ok = ok && await CacheFacade.setApp(appName, appId, appDesc)
        } else {
            appId = app.id
        }

        if (ok && collection.item && collection.item.length > 0) {
            let apis = await this.recursivePostmanItem(collection.item)
            for (let i = 0; i < apis.length; i++) {
                const api = apis[i]
                let apiDesc = await CacheFacade.getApi(appName, 0, api.desc.path)
                let apiId = 0
                if (!apiDesc) {
                    apiId = await CacheFacade.allocateApiId()
                    api.desc.id = apiId
                    api.desc.appId = appId
                    ok = ok && await CacheFacade.setApi(appName, apiId, api.desc.path, api.desc)
                } else {
                    apiId = apiDesc.id
                }
                if (ok && api.exam) {
                    ok = ok && await CacheFacade.setApiExample(appName, apiId, api.exam)
                }
            }
        }

        ctx.response.body = errCode.success('ok')
        await next()
    }

    /**
     * 
     * @param {Array<Object>} arr collection.item or item.item
     * @returns {Array<Object>} apis
     */
    async recursivePostmanItem(arr) {
        let allApi = []

        if (arr && arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                // request
                if (item.request && !item.item) {
                    let rawUrl = typeof item.request.url === 'string' ? item.request.url : item.request.url.raw
                    rawUrl = rawUrl.replace(/{{.*}}/g, 'www.mockingjay.com')
                    let url = new URL(rawUrl)
                    let apiDesc = {
                        name: item.name,
                        description: item.request.description,
                        method: item.request.method,
                        validate: false,
                        forward: false,
                        path: url.pathname
                    }

                    let api = {
                        desc: apiDesc
                    }

                    if (item.response && item.response.length > 0) {
                        let firstRes = item.response[0]
                        let originalReq = firstRes.originalRequest
                        let originalRawUrl = typeof originalReq.url === 'string' ? originalReq.url : originalReq.url.raw
                        originalRawUrl = originalRawUrl.replace(/{{.*}}/g, 'www.mockingjay.com')
                        let originalUrl = new URL(originalRawUrl)
                        let apiExample = {
                            query: queryString.parse(originalUrl.search)
                        }
                        let reqHeaders = {}
                        if (originalReq.header && originalReq.header.length > 0) {
                            for (let j = 0; j < originalReq.header.length; j++) {
                                const header = originalReq.header[j];
                                reqHeaders[header.key] = header.value
                            }
                        }
                        apiExample.reqHeader = reqHeaders
                        if (originalReq.body) {
                            switch (originalReq.body.mode) {
                                case 'raw':
                                    apiExample.reqBody = originalReq.body.raw
                                    break;
                                case 'urlencoded':
                                    {
                                        if (originalReq.body.urlencoded.length > 0) {
                                            apiExample.reqBody = ''
                                            for (let k = 0; k < originalReq.body.urlencoded.length; k++) {
                                                const keyValuePair = originalReq.body.urlencoded[k];
                                                apiExample.reqBody += keyValuePair.key + '=' + keyValuePair.value
                                                if (k < (originalReq.body.urlencoded.length - 1)) {
                                                    apiExample.reqBody += '&'
                                                }
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        let resHheaders = {}
                        if (firstRes.header && firstRes.header.length > 0) {
                            for (let j = 0; j < firstRes.header.length; j++) {
                                const header = firstRes.header[j];
                                resHheaders[header.key] = header.value
                            }
                        }
                        apiExample.resHeader = resHheaders
                        apiExample.resBody = firstRes.body ? firstRes.body : ''

                        api.exam = apiExample
                    }

                    allApi.push(api)
                }
                // folder
                else if (!item.request && item.item && item.item.length > 0) {
                    allApi = allApi.concat(await this.recursivePostmanItem(item.item))
                }
            }
        }

        return allApi
    }

    /**
     * 授予用户APP编辑权限
     * @param {Object} ctx 
     * @param {Function} next 
     */
    async grantUser(ctx, next) {
        let data = ctx.request.body
        if (!data || !data.appId || !data.users || !data.users.length === 0) {
            ctx.response.status = 400
            ctx.response.body = errCode.invalidArguments()
            return
        }

        // validate app
        let app = await CacheFacade.getApp('', data.appId)
        if (!app) {
            ctx.response.status = 400
            ctx.response.body = errCode.invalidArguments
            return
        }

        // validate user privilege
        let userApps = await CacheFacade.getUserApps(ctx.session.userId)
        if (!userApps) {
            ctx.response.status = 200
            ctx.response.body = errCode.resNotFound()
            return
        }

        let valid = false
        let hashKey = CacheKeyCombinator.buildUserAppHashKey(app.name, data.appId)
        for (const key in userApps) {
            if (userApps.hasOwnProperty(key)) {
                if (key.indexOf(hashKey) === 0) {
                    valid = !valid
                    break
                }
            }
        }

        if (!valid) {
            ctx.response.status = 200
            ctx.response.body = errCode.permissionDenied()
            return
        }

        if (CacheFacade.grantAppToUsers(ctx.session.userId, app.name, app.id, data.users)) {
            ctx.response.status = 200
            ctx.response.body = errCode.success()
        }
    }

    async getUserListOfApp(ctx, next) {
        let data = ctx.request.body
        if (!data || !data.appId) {
            ctx.response.status = 400
            ctx.response.body = errCode.invalidArguments
            return
        }

        // validate app
        let app = await CacheFacade.getApp('', data.appId)
        if (!app) {
            ctx.response.status = 400
            ctx.response.body = errCode.invalidArguments
            return
        }

        let users = await CacheFacade.sharedUserOfApp(ctx.session.userId, app.id, app.name)
        ctx.response.status = 200
        ctx.response.body = errCode.success(users)
    }
}

exports = module.exports = new steward()