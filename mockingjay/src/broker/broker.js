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

async function log(ctx, next) {
    await next()

    let appName = ''
    let subPaths = ctx
        .path
        .split('/')
    if (subPaths.length > 2) {
        appName = subPaths[2]
    }

    reqLoggerFactory
        .getLogger(appName)
        .info({
            request: {
                path: ctx
                    .path
                    .toLowerCase()
                    .replace(`/mocking/${appName}`, ''),
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
}

async function generalValidate(ctx, next) {
    let subPaths = ctx.path.split('/')
    if (subPaths.length < 3) {
        set404(ctx)
        return
    } else {
        let appName = subPaths[2]
        let apiPath = subPaths.slice(3)

        let apiSketch = await CacheFacade.getApi(appName, null, apiPath)
        if (!apiSketch) {
            set404(ctx)
            return
        } else {
            apiSketch.appName = appName

            // method not allow
            if (apiSketch.method !== ctx.method) {
                ctx.status = 405
                ctx.body = 'Method Not Allowed'
                return
            } else {
                ctx.apiSketch = apiSketch
                await next()
            }
        }
    }
}

async function validateSchema(ctx, next) {
    let apiSketch = ctx.apiSketch
    if (apiSketch.validate) {
        let apiSchema = await CacheFacade.getApiSchema(apiSketch.appName, apiSketch.id)
        if (apiSchema) {
            let valid = false
            let errors = null

            // req schema validation
            if (apiSchema.properties.query) {
                let target = parseKeyVals(ctx.query, apiSchema.properties.query)

                let validate = ajv.compile(apiSchema.properties.query)
                if (validate(target)) {
                    valid = true
                } else {
                    errors = validate.errors
                }
            } else if (apiSchema.properties.reqHeaders) {
                let target = parseKeyVals(ctx.request.headers, apiSchema.properties.reqHeaders)

                let validate = ajv.compile(target)
                if (validate(ctx.request.headers)) {
                    valid = true
                } else {
                    errors = validate.errors
                }
            } else if (apiSchema.properties.reqBody) {
                await parseBody(ctx, parserOpts.common)
                let validate = ajv.compile(apiSchema.properties.reqBody)
                if (validate(ctx.request.body)) {
                    valid = true
                } else {
                    errors = validate.errors
                }
            }

            if (!valid) {
                ctx.status = 400
                ctx.body = errors
                return
            }

            valid = false

            await next()

            // res schema validation
            if (apiSchema.properties.resHeaders) {
                let target = parseKeyVals(ctx.headers, apiSchema.properties.resHeaders)

                let validate = ajv.compile(apiSchema.properties.resHeaders)
                if (validate(target)) {
                    valid = true
                } else {
                    errors = validate.errors
                }
            } else if (apiSchema.properties.resBody) {
                let validate = ajv.compile(apiSchema.properties.resBody)
                if (validate(ctx.body)) {
                    valid = true
                } else {
                    errors = validate.errors
                }
            }

            if (!valid) {
                ctx.status = 400
                ctx.body = errors
                return
            }
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
                if (appDesc.apiForwardTarget) {
                    if (appDesc.targets && appDesc.targets[appDesc.apiForwardTarget]) {
                        let targetBaseUrl = ''
                        for (let i = 0; i < appDesc.targets.length; i++) {
                            const target = appDesc.targets[i]
                            if (target.name === appDesc.apiForwardTarget) {
                                targetBaseUrl = appDesc.targets[appDesc.apiForwardTarget]
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
    let mockConfig = await CacheFacade.getApiMockCfg(apiSketch.appName, apiSketch.path)
    if (!mockConfig) {
        ctx.status = 400
        ctx.body = 'mock config not found'
    } else {
        if (!mockConfig) {
            await this.set404(ctx // mocking
            )
        } else if (mockConfig.mock) {
            await mocking(ctx, mockConfig.mockCfg)
        }
    }

    await next()
}

function set404(ctx) {
    ctx.status = 404
    ctx.body = 'api not found'
}

function parseKeyVals(src, schema) {
    let keys = []
    for (const key in schema.properties) {
        if (schema.properties.hasOwnProperty(key)) {
            keys.push(key)
        }
    }

    keys.forEach(key => {
        if (src[key]) {
            src[key] = JSON.parse(src[key])
        }
    })

    return src
}

exports = module.exports = router.routes()