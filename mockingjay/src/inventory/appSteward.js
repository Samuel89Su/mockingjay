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

const appComparer = getComparer('id')

const ajv = new Ajv()
const validate = ajv.compile(appSchema)

class steward {
    constructor(arg) {
        this.list = this.list.bind(this)
        this.get = this.get.bind(this)
        this.register = this.register.bind(this)
        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
        this.cahceKeyLenCheck = this.cahceKeyLenCheck.bind(this)
        this.importPostmanCollection = this.importPostmanCollection.bind(this)
        this.recursivePostmanItem = this.recursivePostmanItem.bind(this)
    }

    bindRoutes(router, prefixPath) {
        prefixPath = prefixPath || ''

        router.use(prefixPath + '/*', bodyParser)

        router.get([prefixPath + '/', prefixPath + '/echo'], (ctx, next) => {
            ctx.response.body = 'you are in app inventory now.'
        })
        router.get(prefixPath + '/list', this.list)
        router.get(prefixPath + '/get', this.get)
        router.post(prefixPath + '/register', this.register)
        router.post(prefixPath + '/update', this.update)
        router.post(prefixPath + '/discard', this.discard)
        // router.post('/cahceKeyLenCheck', this.cahceKeyLenCheck)
        router.post(prefixPath + '/importPostmanCollection', this.importPostmanCollection)
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
            page = await CacheFacade.searchAppByPartialName(partialname, pageNum)
        } else {
            page = await CacheFacade.getAppList(pageNum)
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
}

exports = module.exports = new steward()