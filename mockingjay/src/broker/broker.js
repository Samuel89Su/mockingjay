'use strict'

const logger = require('../common/logger')
const reqLoggerFactory = require('../common/RequestLoggerFactory')
const mocking = require('./mocking')
const forward = require('./forward')
const Router = require('koa-router')
const Ajv = require('ajv')
const parseBody = require('../common/parseBody')
const parserOpts = require('../common/bodyParserOpts')
const CacheFacade = require('../common/CacheFacade')

const router = new Router()
router.use('/*', log, generalValidate, validateSchema, forwardReq, mock)

const ajv = new Ajv()

/**
 * error handling & logging
 */
async function log(ctx, next) {
    try {
        let appName = ''
        let subPaths = ctx.path.split('/')
        if (subPaths.length > 2) {
            appName = subPaths[2]
        }
        if (!appName) {
            ctx.status = 400
            ctx.body = 'App name has not been specificed'
            return
        }

        let replacePattern = new RegExp('/' + subPaths[1] + '/' + appName, 'i')
        let apiPath = ctx.path.replace(replacePattern, '')

        let apiSketch = await CacheFacade.getApi(appName, null, apiPath)
        if (!apiSketch) {
            set404(ctx)
            return
        } else {
            apiSketch.appName = appName
        }

        ctx.apiSketch = apiSketch

        const logger = reqLoggerFactory.getLogger(appName)
        ctx.logger = logger

        await next()

        logger.info({
            request: {
                path: apiPath,
                method: ctx.method,
                queryString: ctx.querystring,
                headers: ctx.request.headers,
                body: ctx.request.body
            },
            response: {
                headers: ctx.response.headers,
                body: ctx.body
            }
        })
    } catch (error) {
        if (ctx.logger) {
            ctx.logger.error({
                request: {
                    path: ctx.apiSketch.path,
                    method: ctx.method,
                    queryString: ctx.querystring,
                    headers: ctx.request.headers,
                    body: ctx.request.body
                },
                error: {
                    msg: error.message,
                    stack: error.stack
                }
            })
        }

        ctx.status = 500
        ctx.body = {
            msg: error.message,
            stack: error.stack
        }

        return
    }
}

async function generalValidate(ctx, next) {
    let apiSketch = ctx.apiSketch

    // method not allow
    if (apiSketch.method !== ctx.method) {
        ctx.status = 405
        ctx.body = 'Method Not Allowed'
        return
    }

    await next()
}

const validateMediaTypes = ['application/json', 'text/html', 'text/plain', 'text/xml']
async function validateSchema(ctx, next) {
    let apiSketch = ctx.apiSketch
    if (apiSketch.validate) {
        let apiSchema = await CacheFacade.getApiSchema(apiSketch.appName, apiSketch.id)
        if (apiSchema) {
            // req schema validation
            if (apiSchema.properties.query) {
                let target = retrieveAndStringify(ctx.query, apiSchema.properties.query)

                let validate = ajv.compile(apiSchema.properties.query)
                if (!validate(target)) {
                    set400(ctx, validate.errors)
                    return
                }
            }
            if (apiSchema.properties.reqHeaders) {
                let target = retrieveAndStringify(ctx.request.headers, apiSchema.properties.reqHeaders)

                let validate = ajv.compile(target)
                if (!validate(ctx.request.headers)) {
                    set400(ctx, validate.errors)
                    return
                }
            }
            // only validate specific ContentType
            if (ctx.header['content-type']) {
                let needValidate = false
                for (let i = 0; i < validateMediaTypes.length; i++) {
                    const mediaType = validateMediaTypes[i];
                    if (mediaType === ctx.header['content-type']) {
                        needValidate = true
                        break
                    }
                }
                if (needValidate && apiSchema.properties.reqBody) {
                    await parseBody(ctx, parserOpts.common)
                    let validate = ajv.compile(apiSchema.properties.reqBody)
                    if (!validate(ctx.request.body)) {
                        set400(ctx, validate.errors)
                        return
                    }
                }
            }

            await next()

            // res schema validation
            if (apiSchema.properties.resHeaders) {
                let target = retrieveAndStringify(ctx.headers, apiSchema.properties.resHeaders)

                let validate = ajv.compile(apiSchema.properties.resHeaders)
                if (!validate(target)) {
                    set400(ctx, validate.errors)
                    return
                }
            } 
            if (apiSchema.properties.resBody) {
                let validate = ajv.compile(apiSchema.properties.resBody)
                if (!validate(ctx.body)) {
                    set400(ctx, validate.errors)
                    return
                }
            }
        } else {
            await next()
        }
    } else {
        await next()
    }
}

async function forwardReq(ctx, next) {
    let apiSketch = ctx.apiSketch
    if (apiSketch.forward) {
        let appDesc = CacheFacade.getApp(apiSketch.appName, 0)
        if (appDesc) {
            if (appDesc) {
                let target = apiSketch.forwardTarget || appDesc.apiForwardTarget
                if (target) {
                    if (appDesc.targets && appDesc.targets[appDesc.apiForwardTarget]) {
                        let targetBaseUrl = ''
                        for (let i = 0; i < appDesc.targets.length; i++) {
                            const target = appDesc.targets[i]
                            if (target.name === appDesc.apiForwardTarget) {
                                targetBaseUrl = appDesc.targets[target]
                            }
                        }
                        if (targetBaseUrl) {
                            let resOpts = await forward(ctx.req, targetBaseUrl, apiSketch.path)
                            ctx.body = resOpts.body
                            try {
                                ctx
                                    .response
                                    .set(resOpts.headers)
                            } catch (error) {
                                console.log(error)
                            }
                        } else {
                            ctx.status = 400
                            ctx.body = 'target not found.'
                        }
                    } else {
                        ctx.status = 400
                        ctx.body = 'there is no targets in app registration.'
                    }
                } else {
                    ctx.status = 400
                    ctx.body = 'forward target is not specified in app registration.'
                }
            } else {
                ctx.status = 400
                ctx.body = 'app registration info not found or invalid.'
            }
        }

        return
    } else {
        await next()
    }
}

async function mock(ctx, next) {
    let apiSketch = ctx.apiSketch
    let mockCfg = await CacheFacade.getApiMockCfg(apiSketch.appName, apiSketch.path)
    if (!mockCfg) {
        ctx.status = 400
        ctx.body = 'mock config not found'
    } else {
        if (!mockCfg) {
            await this.set404(ctx // mocking
            )
        } else if (mockCfg.mock) {
            await mocking(ctx, mockCfg)
        }
    }

    await next()
}

function set404(ctx) {
    ctx.status = 404
    ctx.body = 'api not found'
}

function set400(ctx, err) {    
    ctx.status = 400
    ctx.body = err
}

function retrieveAndStringify(src, schema) {
    let keys = []
    for (const key in schema.properties) {
        if (schema.properties.hasOwnProperty(key)) {
            keys.push(key)
        }
    }

    keys.forEach(key => {
        if (src[key]) {
            try {
                let val = src[key]
                if (val && typeof val !== 'string') {
                    val = val.toString()
                }
                src[key] = val
            } catch (error) {
            }
        }
    })

    return src
}

exports = module.exports = router.routes()