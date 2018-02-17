'use strict'

const Router = require('koa-router')
const Ajv = require('ajv')
const logger = require('../common/logger')
const errCode = require('./errCode')
const bodyParser = require('../common/bodyParser')
const appSchema = require('../Schemas/appSchema')
const schemaRaker = require('../utils/jsonRaker')
const CacheFacade = require('../common/CacheFacade')

const ajv = new Ajv()
const validate = ajv.compile(appSchema)

class steward {
    constructor(arg) {
        this.router = new Router()

        this.list = this.list.bind(this)
        this.get = this.get.bind(this)
        this.register = this.register.bind(this)
        this.update = this.update.bind(this)
        this.discard = this.discard.bind(this)
    }

    getRouter() {
        this.router.get(['/', '/echo'], (ctx, next) => {
            ctx.response.body = 'you are in app inventory now.'
        })
        this.router.get('/list', this.list)
        this.router.get('/get', this.get)
        this.router.post('/register', bodyParser, this.register)
        this.router.post('/update', bodyParser, this.update)
        this.router.post('/discard', bodyParser, this.discard)

        return this.router
    }

    /**
     * fetch app list
     */
    async list(ctx, next) {
        let apps = await CacheFacade.getAppList()

        apps = apps.sort(idASCSorter)

        ctx.response.body = errCode.success(apps)
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
}

function idASCSorter(a, b) {
    return a.id - b.id
}

exports = module.exports = new steward()