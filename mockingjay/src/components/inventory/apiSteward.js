'use strict';

const Router = require('koa-router');
var Ajv = require('ajv');
const redisClient = require('../common/redisClient');
const cacheKeys = require('../common/cacheKeys');
const logger = require('../common/logger');
const errCode = require('./errCode');
const commonBodyParser = require('../common/bodyParser');
const cfgSchema = require('./apiCfg_schema');
const apiRegisterSchema = require('./apiRegisterSchema');

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const cfgValidate = ajv.compile(cfgSchema);
const registerValidate = ajv.compile(apiRegisterSchema);

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
        this.router.post('/config', commonBodyParser, this.config);
        this.router.post('/updateconfig', commonBodyParser, this.updateConfig);
        this.router.post('/removeconfig', commonBodyParser, this.removeConfig);

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
            
            let appDesc = getAppConfig(arg.appId);
            if (!appDesc) {
                ctx.response.body = errCode.resNotFound();
            } else {
                let key = `${ cacheKeys.apiInventory }:${ appDesc.name }`
                let jsonList = await redisClient.hgetallAsync(key);
                let apis = [];
                for (const id in jsonList) {
                    if (jsonList.hasOwnProperty(id)) {
                        const apiJson = jsonList[id];
                        apis.push(JSON.parse(apiJson));
                    }
                }

                ctx.response.body = errCode.success(apis);
            }
        }

        await next();
    }

    async register(ctx, next) {
        let apiData = ctx.request.body;
        // validate
        var valid = registerValidate(apiData);
        if (!valid) {
            ctx.response.status = 400;
            ctx.response.body = registerValidate.errors;
            return await next();
        }

        let appDesc = getAppConfig(arg.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

        let id = await redisClient.incrAsync(cacheKeys.apiId);
        let apiSketch = {
            apiId: id,
            name: apiData.name,
            description: apiData.description,
            path: apiData.path,
            method: apiData.method
        };
        let baseKey = `${ cacheKeys.apiInventory }:${ appDesc.name }`
        let ok = await redisClient.hsetAsync(baseKey, id, JSON.stringify(apiSketch)) >= 0;
        if (ok) {
            let cacheKey = `${ baseKey }:${ id }_schema`
            ok = await redisClient.setAsync(cacheKey, JSON.stringify(apiData.schema)) === 'OK';
            if (ok) {
                ctx.response.body = errCode.success(apiData);
            } else {
                ctx.response.body = errCode.dbErr();
            }
        } else {
            ctx.response.body = errCode.dbErr();
        }

        await next();
    }

    async update(ctx, next) {
        let apiData = ctx.request.body;

        // validate
        var valid = registerValidate(apiData);
        if (!valid) {
            ctx.response.status = 400;
            ctx.response.body = registerValidate.errors;
            return await next();
        }

        let appDesc = getAppConfig(arg.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

        let baseKey = `${ cacheKeys.apiInventory }:${ appDesc.name }`

        // check is existed
        let apiId = apiData.apiId;
        let ok = await redisClient.hexistsAsync(baseKey, apiId) === 1;
        if (!ok) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

        let apiSketch = {
            apiId: apiId,
            name: apiData.name,
            description: apiData.description,
            path: apiData.path,
            method: apiData.method
        };
        ok = await redisClient.hsetAsync(baseKey, apiId, JSON.stringify(apiSketch)) >= 0;
        if (ok) {
            let cacheKey = `${ baseKey }:${ apiId }_schema`
            ok = await redisClient.setAsync(cacheKey, JSON.stringify(apiData.schema)) === 'OK';
            if (ok) {
                ctx.response.body = errCode.success(apiData);
            } else {
                ctx.response.body = errCode.dbErr();
            }
        } else {
            ctx.response.body = errCode.dbErr();
        }

        await next();
    }

    async remove(ctx, next) {
        let arg = ctx.request.body;
        if (!arg.appId || arg.appId === 0 || !arg.id || arg.id === 0) {
            ctx.response.status = 400;
            ctx.response.body = "appId or id is missing.";
            return await next();
        }

        let appDesc = getAppConfig(arg.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

        let baseKey = `${ cacheKeys.apiInventory }:${ appDesc.name }`
        let ok = await redisClient.hdelAsync(baseKey, arg.id) > 0;
        if (!ok) {
            ctx.response.body = errCode.success();
            return await next();
        }

        let cacheKey = `${ baseKey }:${ apiId }_schema`
        ok = await redisClient.delAsync(cacheKey) >= 0;
        if (ok) {
            ctx.response.body = errCode.success(arg);
        } else {
            ctx.response.body = errCode.dbErr();
        }

        await next();
    }

    async config(ctx, next) {
        let apiConfig = ctx.request.body;
        // validate
        var valid = cfgValidate(apiConfig);
        if (!valid) {
            ctx.response.status = 400;
            ctx.response.body = cfgValidate.errors;
            return await next();
        }

        let appDesc = getAppConfig(apiConfig.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

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

    async updateConfig(ctx, next) {
        let apiConfig = ctx.request.body;
        // validate
        var valid = cfgValidate(apiConfig);
        if (!valid) {
            ctx.response.status = 400;
            ctx.response.body = cfgValidate.errors;
            return await next();
        }

        let appDesc = getAppConfig(apiConfig.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

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

    async removeConfig(ctx, next) {
        let apiConfig = ctx.request.body;
        if (!apiConfig.apiId || !apiConfig.appId) {
            ctx.response.status = 400;
            ctx.response.body = "apiId is missing.";
            return await next();
        }

        let appDesc = getAppConfig(apiConfig.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

        let baseKey = `${ cacheKeys.apiInventory }:${ appDesc.name }`

        // check is existed
        let apiId = apiData.apiId;
        let apiSketch = await redisClient.hgetAsync(baseKey, apiConfig.apiId);
        if (!apiSketch) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

        let path = apiSketch.path;
        let segments = path.split('/');
        let validSegs = [];
        segments.forEach(seg => {
            if (seg.length > 0) {
                validSegs.push(seg);
            }
        });

        let cacheKey = `${ cacheKeys.apiInventory }:${ appDesc.name }:${ validSegs.join('_') }`
        let ok = await redisClient.delAsync(cacheKey) >= 0;
        if (ok) {
            ctx.response.body = errCode.success();
        } else {
            ctx.response.body = errCode.dbErr();
        }

        await next();
    }    

    getAppConfig (appId) {
        let appCacheKey = `${ cacheKeys.appInventory }:${ appId }`
        let appDescStr = await redisClient.getAsync(appCacheKey);
        if (!appDescStr) {
            return null;
        } else {
            try {
                let appDesc = JSON.parse(appDescStr);
                if (!appDesc) {
                    return null;
                } else {
                    return appDesc;
                }
            } catch (error) {
                logger.error(error);
                return null;
            }
        }
    }
}

exports = module.exports = new Steward();