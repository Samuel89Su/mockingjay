'use strict'

const Router = require('koa-router')
var Ajv = require('ajv')
const logger = require('../common/logger')
const errCode = require('./errCode')
const commonBodyParser = require('../common/bodyParser')
const cfgSchema = require('../Schemas/apiCfgSchema')
const apiRegistrationSchema = require('../Schemas/apiRegistrationSchema')
const jsonParse = require('../utils').parse
const CacheFacade = require('../common/CacheFacade')

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const cfgValidate = ajv.compile(cfgSchema)
const apiSchemaValidate = ajv.compile(apiRegistrationSchema)

class Steward {
    constructor(arg) {
        this.router = new Router()
        this.list = this.list.bind(this)
        this.register = this.register.bind(this)
        this.update = this.update.bind(this)
        this.remove = this.discard.bind(this)
        this.config = this.mockCfg.bind(this)
        this.updateConfig = this.updateMockCfg.bind(this)
        this.removeConfig = this.removeMockCfg.bind(this)
        this.getAppConfig = this.getAppConfig.bind(this)
        this.getApiSchema = this.getApiSchema.bind(this)
        this.getApiMockCfg = this.getApiMockCfg.bind(this)
        this.updateSchema = this.updateSchema.bind(this)
        this.updateMockCfg = this.updateMockCfg.bind(this)
        this.getExample = this.getExample.bind(this)
        this.updateExample = this.updateExample.bind(this)
    }

    getRouter() {
        this.router.use('/*', commonBodyParser)
        this.router.get(['/', '/echo'], (ctx, next) => {
            ctx.response.body = 'you are in api inventory now.'
        })
        this.router.get('/list', this.list)
        this.router.get('/get', this.get)
        this.router.post('/register', this.register)
        this.router.post('/update', this.update)
        this.router.post('/discard', this.discard)
        this.router.post('/updateschema', this.updateSchema)
        this.router.post('/mockcfg', this.mockCfg)
        this.router.post('/updatemockcfg', this.updateMockCfg)
        this.router.post('/removemockcfg', this.removeMockCfg)
        this.router.post('/getapischema', this.getApiSchema)
        this.router.post('/getmockcfg', this.getApiMockCfg)
        this.router.post('/getexample', this.getExample)
        this.router.post('/updateexample', this.updateExample)

        return this.router
    }

    // retrieve api list by app id
    async list(ctx, next) {
        let appId = -1
        let pageNum = 0
        if (ctx.query) {
            for (const key in ctx.query) {
                if (key.toLowerCase() === 'appid') {
                    appId = parseInt(ctx.query[key])
                } else if (key.toLowerCase() === 'pagenum') {
                    pageNum = parseInt(ctx.query[key])
                }
            }
        }
        if (1 > appId) {
            ctx.response.status = 400
            ctx.response.body = 'appId CAN NOT be null or empty'
        } else {
            //TODO: check is app registered

            let appDesc = await this.getAppConfig(appId)
            if (!appDesc) {
                ctx.response.body = errCode.resNotFound()
            } else {
                let page = await CacheFacade.getApiList(appDesc.name, pageNum)

                ctx.response.body = errCode.success(page)
            }
        }

        await next()
    }

    async get(ctx, next) {
        let appName = ''
        let apiId = ''
        if (ctx.query) {
            for (const key in ctx.query) {
                if (key.toLowerCase() === 'appname') {
                    appName = ctx.query[key].toLowerCase()
                }
                if (key.toLowerCase() === 'id') {
                    apiId = ctx.query[key].toLowerCase()
                }
            }
        }
        if (!appName || !apiId) {
            ctx.response.status = 400
            ctx.response.body = 'key CAN NOT be null or empty'
        } else {
            //TODO: check is app registered

            let apiCfg = await CacheFacade.getApi(appName, parseInt(apiId), null)

            ctx.response.body = errCode.success(apiCfg)
        }

        await next()
    }

    async register(ctx, next) {
        let apiData = ctx.request.body
        // validate
        var valid = apiSchemaValidate(apiData)
        if (!valid) {
            ctx.response.status = 400
            ctx.response.body = apiSchemaValidate.errors
            return await next()
        }

        let appDesc = await this.getAppConfig(apiData.appId)
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound()
            return await next()
        }

        let id = await CacheFacade.allocateApiId()
        let apiSketch = {
            id: id,
            name: apiData.name,
            description: apiData.description,
            path: apiData.path,
            method: apiData.method,
            appId: apiData.appId,
            validate: apiData.validate,
            forward: apiData.forward
        }

        let ok = await CacheFacade.setApi(appDesc.name, id, apiSketch.path, apiSketch)
        if (!ok) {
            ctx.response.body = errCode.dbErr()
        } else {
            if (apiData.schema) {
                ok = await CacheFacade.setApiSchema(appDesc.name, id, apiData.schema)
                if (ok) {
                    apiData.id = id
                    ctx.response.body = errCode.success(apiData)
                } else {
                    ctx.response.body = errCode.dbErr()
                }
            }

            apiData.id = id
            ctx.response.body = errCode.success(apiData)
        }

        await next()
    }

    async update(ctx, next) {
        let apiData = ctx.request.body

        // validate
        var valid = apiSchemaValidate(apiData)
        if (!valid) {
            ctx.response.status = 400
            ctx.response.body = apiSchemaValidate.errors
            return await next()
        } else if (!apiData.id) {
            ctx.response.status = 400
            ctx.response.body = "id is missing.."
            return await next()
        }

        let appDesc = await this.getAppConfig(apiData.appId)
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound()
            return await next()
        }

        // check is existed
        let apiId = apiData.id
        let apiDesc = await CacheFacade.getApi(appDesc.name, apiId, apiData.path)
        if (!apiDesc) {
            ctx.response.body = errCode.resNotFound()
            return await next()
        }

        let apiSketch = {
            id: apiId,
            name: apiData.name,
            description: apiData.description,
            path: apiData.path,
            method: apiData.method,
            appId: apiData.appId,
            validate: apiData.validate,
            forward: apiData.forward
        }
        let ok = await CacheFacade.setApi(appDesc.name, apiId, apiData.path, apiSketch)
        if (!ok) {
            ctx.response.body = errCode.dbErr()
        } else if (apiData.schema) {
            ok = await CacheFacade.setApiSchema(appDesc.name, apiId, apiData.schema)
            if (ok) {
                ctx.response.body = errCode.success(apiData)
            } else {
                ctx.response.body = errCode.dbErr()
            }
        } else {
            ctx.response.body = errCode.success(apiData)
        }

        await next()
    }

    async discard(ctx, next) {
        let arg = ctx.request.body
        if (!arg.appId || !arg.id) {
            ctx.response.status = 400
            ctx.response.body = "appId or id is missing."
            return await next()
        }

        let appDesc = await this.getAppConfig(arg.appId)
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound()
            return await next()
        }

        let apiDescRaw = CacheFacade.getApi(appDesc.name, arg.id, null)
        let apiDesc = JSON.parse(apiDescRaw)

        let ok = CacheFacade.delApi(appDesc.name, arg.id, apiDesc.path)
        if (ok) {
            ctx.response.body = errCode.success()
        } else {
            ctx.response.body = errCode.dbErr()
        }

        await next()
    }

    async updateSchema(ctx, next) {
        let apiData = ctx.request.body
        apiData = jsonParse(apiData)
        if (!apiData.appId || apiData.appId === 0 || !apiData.id || apiData.id === 0) {
            ctx.response.status = 400
            ctx.response.body = 'parameter not completed'
            return await next()
        }

        let appDesc = await this.getAppConfig(apiData.appId)
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound()
            return await next()
        }

        if (!apiData.schema) {
            ctx.response.status = 400
            ctx.response.body = 'schema is missing'
            return await next()
        }

        let ok = await CacheFacade.setApiSchema(appDesc.name, apiData.id, apiData.schema)
        if (ok) {
            if (apiData.schema.properties) {
                for (const key in apiData.schema.properties) {
                    if (apiData.schema.properties.hasOwnProperty(key)) {
                        const prop = apiData.schema.properties[key]
                        apiData.schema.properties[key] = JSON.stringify(prop)
                    }
                }
            }
            ctx.response.body = errCode.success(apiData.schema)
        } else {
            ctx.response.body = errCode.dbErr()
        }

        await next()
    }

    async mockCfg(ctx, next) {
        let apiConfig = ctx.request.body
        // validate
        var valid = cfgValidate(apiConfig)
        if (!valid) {
            ctx.response.status = 400
            ctx.response.body = cfgValidate.errors
            return await next()
        }

        let appDesc = await this.getAppConfig(apiConfig.appId)
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound()
            return await next()
        }

        let ok = await CacheFacade.setApiMockCfg(appDesc.name, apiConfig.path, apiConfig)
        if (ok) {
            ctx.response.body = errCode.success(apiConfig)
        } else {
            ctx.response.body = errCode.dbErr()
        }

        await next()
    }

    async updateMockCfg(ctx, next) {
        let mockCfg = ctx.request.body
        mockCfg = jsonParse(mockCfg)
        // validate
        var valid = cfgValidate(mockCfg)
        if (!valid) {
            ctx.response.status = 400
            ctx.response.body = cfgValidate.errors
            return await next()
        } else if (!mockCfg.id) {
            ctx.response.status = 400
            ctx.response.body = "id missing."
            return await next()
        }

        let appDesc = await this.getAppConfig(mockCfg.appId)
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound()
            return await next()
        }

        let ok = await CacheFacade.setApiMockCfg(appDesc.name, mockCfg.path, mockCfg)
        if (ok) {
            ctx.response.body = errCode.success(mockCfg)
        } else {
            ctx.response.body = errCode.dbErr()
        }

        await next()
    }

    async removeMockCfg(ctx, next) {
        let apiConfig = ctx.request.body
        if (!apiConfig.id || !apiConfig.appId) {
            ctx.response.status = 400
            ctx.response.body = "id is missing."
            return await next()
        }

        let appDesc = await this.getAppConfig(apiConfig.appId)
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound()
            return await next()
        }

        let ok = await CacheFacade.delApiMockCfg(appDesc.name, apiConfig.path)
        if (ok) {
            ctx.response.body = errCode.success()
        } else {
            ctx.response.body = errCode.dbErr()
        }

        await next()
    }

    async getApiSchema(ctx, next) {
        let args = ctx.request.body

        let apiSchema = await CacheFacade.getApiSchema(args.appName, parseInt(args.id))
        if (apiSchema && apiSchema.properties) {
            for (const key in apiSchema.properties) {
                if (apiSchema.properties.hasOwnProperty(key)) {
                    const prop = apiSchema.properties[key]
                    apiSchema.properties[key] = JSON.stringify(prop)
                }
            }
        }
        ctx.response.body = errCode.success(apiSchema ? apiSchema : {})

        await next()
    }

    async getApiMockCfg(ctx, next) {
        let apiData = ctx.request.body
        if (!apiData.id || !apiData.appName) {
            ctx.response.status = 400
            ctx.response.body = "id or appName is missing."
            return await next()
        }
        apiData.id = parseInt(apiData.id)

        let appDesc = await this.getAppConfig(0, apiData.appName)

        let apiDesc = await CacheFacade.getApi(appDesc.name, apiData.id, null)

        let mockCfg = await CacheFacade.getApiMockCfg(appDesc.name, apiDesc.path)
        if (!mockCfg) {
            mockCfg = {}
        }

        ctx.response.body = errCode.success(mockCfg)

        await next()
    }

    async getAppConfig(appId, appName) {
        let appDesc = await CacheFacade.getApp(appName ? appName : '', appId)
        if (!appDesc) {
            return null
        } else {
            return appDesc
        }
    }

    async getExample(ctx, next) {
        let args = ctx.request.body

        let apiExample = await CacheFacade.getApiExample(args.appName, parseInt(args.id))
        ctx.response.body = errCode.success(apiExample ? apiExample : {})

        await next()
    }

    async updateExample(ctx, next) {
        let apiData = ctx.request.body
        apiData = jsonParse(apiData)
        if (!apiData.appId || apiData.appId === 0 || !apiData.id || apiData.id === 0) {
            ctx.response.status = 400
            ctx.response.body = 'parameter not completed'
            return await next()
        }

        let appDesc = await this.getAppConfig(apiData.appId)
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound()
            return await next()
        }

        if (!apiData.example) {
            ctx.response.status = 400
            ctx.response.body = 'example is missing'
            return await next()
        }

        let ok = await CacheFacade.setApiExample(appDesc.name, apiData.id, apiData.example)
        if (ok) {
            ctx.response.body = errCode.success(apiData.schema)
        } else {
            ctx.response.body = errCode.dbErr()
        }

        await next()
    }
}

exports = module.exports = new Steward()