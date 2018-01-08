'use strict';

const Router = require('koa-router');
var Ajv = require('ajv');
const redisClient = require('../common/redisClient');
const cacheKeys = require('../common/cacheKeys');
const logger = require('../common/logger');
const errCode = require('./errCode');
const commonBodyParser = require('../common/bodyParser');
const cfgSchema = require('./apiCfg_schema');

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const validate = ajv.compile(cfgSchema);

class Steward {
    constructor(arg) {
        this.router = new Router();
    }

    getRouter() {
        this.router.get(['/', '/echo'], (ctx, next) => {
            ctx.response.body = 'you are in api inventory now.';
        });
        this.router.get('/list', this.list);
        this.router.post('/register', commonBodyParser, this.register);
        this.router.post('/update', commonBodyParser, this.update);
        this.router.post('/remove', commonBodyParser, this.remove);

        return this.router;
    }

    // retrieve api list by app id
    async list(ctx, next) {
        let appId = -1;
        if (ctx.query) {
            for (const key in ctx.query) {
                if (key.toLowerCase() === 'appid') {
                    appId = parseInt(ctx.query[key]);
                    break;
                }
            }
        }
        if (1 > appId) {
            ctx.response.status = 400;
            ctx.response.body = 'appId CAN NOT be null or empty';
        } else {
            //TODO: check is app registered            
            let appCacheKey = `${ cacheKeys.appInventory }:${ appId }`
            let appDescStr = await redisClient.getAsync(appCacheKey);
            if (!appDescStr || appDescStr.length < 10) {
                ctx.response.body = errCode.resNotFound();
            } else {
                let appDesc = JSON.parse(appDescStr);
                let keyPattern = `${ cacheKeys.apiInventory }:${ appDesc.name }:*`
                let keys = await redisClient.keysAsync(keyPattern);
                let apis = [];
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    let apiConfig = await redisClient.getAsync(key);
                    apis.push(JSON.parse(apiConfig));
                }

                ctx.response.body = errCode.success(apis);
            }

        }

        await next();
    }

    async register(ctx, next) {
        let apiConfig = ctx.request.body;
        // validate
        var valid = validate(apiConfig);
        if (!valid) {
            ctx.response.status = 400;
            ctx.response.body = validate.errors;
            return await next();
        }

        let appCacheKey = `${ cacheKeys.appInventory }:${ apiConfig.appId }`
        let appDescStr = await redisClient.getAsync(appCacheKey);
        let appDesc = JSON.parse(appDescStr);

        let path = apiConfig.path;
        let segments = path.split('/');
        let validSegs = [];
        segments.forEach(seg => {
            if (seg.length > 0) {
                validSegs.push(seg);
            }
        });

        let cacheKey = `${ cacheKeys.apiInventory }:${ appDesc.name }:${ validSegs.join('_') }`
        let ok = await redisClient.setAsync(cacheKey, JSON.stringify(apiConfig)) === 'OK';
        if (ok) {
            ctx.response.body = errCode.success(apiConfig);
        } else {
            ctx.response.body = errCode.dbErr();
        }

        await next();
    }

    async update(ctx, next) {
        let apiConfig = ctx.request.body;
        // validate
        var valid = validate(apiConfig);
        if (!valid) {
            ctx.response.status = 400;
            ctx.response.body = validate.errors;
            return await next();
        }

        let appCacheKey = `${ cacheKeys.appInventory }:${ apiConfig.appId }`
        let appDescStr = await redisClient.getAsync(appCacheKey);
        let appDesc = JSON.parse(appDescStr);

        let path = apiConfig.path;
        let segments = path.split('/');
        let validSegs = [];
        segments.forEach(seg => {
            if (seg.length > 0) {
                validSegs.push(seg);
            }
        });

        let cacheKey = `${ cacheKeys.apiInventory }:${ appDesc.name }:${ validSegs.join('_') }`
        let ok = await redisClient.setAsync(cacheKey, JSON.stringify(apiConfig)) === 'OK';
        if (ok) {
            ctx.response.body = errCode.success(apiConfig);
        } else {
            ctx.response.body = errCode.dbErr();
        }

        await next();
    }

    async remove(ctx, next) {
        let apiConfig = ctx.request.body;
        if (!apiConfig.appId || !apiConfig.path) {
            ctx.response.status = 400;
            ctx.response.body = validate.errors;
            return await next();
        }

        let appCacheKey = `${ cacheKeys.appInventory }:${ apiConfig.appId }`
        let appDescStr = await redisClient.getAsync(appCacheKey);
        let appDesc = JSON.parse(appDescStr);

        let path = apiConfig.path;
        let segments = path.split('/');
        let validSegs = [];
        segments.forEach(seg => {
            if (seg.length > 0) {
                validSegs.push(seg);
            }
        });

        let cacheKey = `${ cacheKeys.apiInventory }:${ appDesc.name }:${ validSegs.join('_') }`
        let ok = await redisClient.delAsync(cacheKey);
        if (parseInt(ok) > 0) {
            ctx.response.body = errCode.success(apiConfig);
        } else {
            ctx.response.body = errCode.dbErr();
        }

        await next();
    }
}

exports = module.exports = new Steward();