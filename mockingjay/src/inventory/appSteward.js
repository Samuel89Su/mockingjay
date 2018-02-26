'use strict'

const Router = require('koa-router')
const Ajv = require('ajv')
const logger = require('../common/logger')
const errCode = require('./errCode')
const bodyParser = require('../common/bodyParser')
const appSchema = require('../Schemas/appSchema')
const schemaRaker = require('../utils').rake
const CacheFacade = require('../common/CacheFacade')
const getComparer = require('../utils').getComparer

const appComparer = getComparer('id')

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
}

exports = module.exports = new steward()