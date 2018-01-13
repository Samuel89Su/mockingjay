'use strict';

const redisClient = require('../common/redisClient');
const cacheKeys = require('../common/cacheKeys');
const logger = require('../common/logger');
const requestLogger = require('../common/requestLogger');
const mocking = require('./mocking');
const forward = require('./forward');
const Router = require('koa-router');

const router = new Router();
router
    .use('/*',
        log,
        generalValidate,
        validateSchema,
        forwardReq,
        mock);

async function log(ctx, next) {
    await next()

    requestLogger.info({
        request: {
            path: ctx.path,
            method: ctx.method,
            queryString: ctx.querystring,
            headers: ctx.request.headers,
            body: ctx.request.body
        },
        response: {
            headers: ctx.headers,
            body: ctx.body
        }
    });
}

async function generalValidate(ctx, next) {
    let subPaths = ctx.path.split('/')
    if (subPaths.length < 3) {
        set404(ctx)
        return
    } else {
        let appName = subPaths[2]
        let apiKey = subPaths.slice(3).join('_')

        let baseKey = `${ cacheKeys.apiInventory }:${ appName.toLowerCase() }`
        let apiSketch = await redisClient.hgetAsync(baseKey, apiKey)
        if (!apiSketch) {
            set404(ctx)
            return
        } else {
            apiSketch = JSON.parse(apiSketch)
            apiSketch.baseKey = baseKey

            // method not allow
            if (apiSketch.method !== ctx.method) {
                ctx.status = 405
                ctx.body = 'Method Not Allowed'
                return
            } else {
                ctx.apiSketch = apiSketch
                await next();
            }
        }
    }
}

async function validateSchema(ctx, next) {
    let apiSketch = ctx.apiSketch
    if (apiSketch.validate) {
        let schemaKey = `${ apiSketch.baseKey }:${ apiSketch.apiId }_schema`
        let apiSchema = await redisClient.getAsync(schemaKey)
        if (apiSchema) {
            apiSchema = JSON.parse(apiSchema)

            let valid = false

            // TODO: req schema validation

            if (!valid) {
                ctx.status = 400
                ctx.body = 'bad request, req schema validate failed.'
                return
            }

            valid = false

            await next()

            // TODO: res schema validation

            if (!valid) {
                ctx.status = 400
                ctx.body = 'bad response, res schema validate failed.'
                return
            }
        }
    }

    await next()
}

async function forwardReq(ctx, next) {
    let apiSketch = ctx.apiSketch
    if (apiSketch.forward) {
        let appDesc = await redisClient.getAsync(`${ cacheKeys.appInventory }:${ apiSketch.appId }`)
        if (appDesc) {
            appDesc = JSON.parse(appDesc)
            if (appDesc) {
                if (appDesc.apiForwardTarget) {
                    if (appDesc.targets && appDesc.targets[appDesc.apiForwardTarget]) {
                        let targetBaseUrl = appDesc.targets[appDesc.apiForwardTarget]
                        let resOpts = await forward(ctx.req, targetBaseUrl, apiSketch.path)
                        ctx.body = resOpts.body
                        try {
                            ctx.response.set(resOpts.headers)
                        } catch (error) {
                            console.log(error)
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
        await next();
    }
}

async function mock(ctx, next) {
    let apiSketch = ctx.apiSketch
    let cacheKey = `${ apiSketch.baseKey }:${ apiSketch.apiId }_mockCfg`
    let mockConfig = await redisClient.getAsync(cacheKey)
    if (!mockConfig) {
        ctx.status = 400
        ctx.body = 'mock config not found'
    } else {
        mockConfig = JSON.parse(mockConfig)
        if (!mockConfig) {
            await this.set404(ctx)
        }
        // mocking 
        else if (mockConfig.mock) {
            await mocking(ctx, mockConfig.mockCfg)
        }
    }

    await next()
}

function set404(ctx) {
    ctx.status = 404;
    ctx.body = 'api not found';
}

exports = module.exports = router.routes()