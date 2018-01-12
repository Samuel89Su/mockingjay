'use strict';

const Router = require('koa-router');
var Ajv = require('ajv');
const redisClient = require('../common/redisClient');
const cacheKeys = require('../common/cacheKeys');
const logger = require('../common/logger');
const errCode = require('./errCode');
const commonBodyParser = require('../common/bodyParser');
const cfgSchema = require('../Schemas/apiCfgSchema');
const apiSchema = require('../Schemas/apiSchema');

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const cfgValidate = ajv.compile(cfgSchema);
const apiSchemaValidate = ajv.compile(apiSchema);

class Steward {
    constructor(arg) {
        this.router = new Router();
        this.list = this.list.bind(this);
        this.register = this.register.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.config = this.config.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
        this.removeConfig = this.removeConfig.bind(this);
        this.getAppConfig = this.getAppConfig.bind(this);
        this.getApiSchema = this.getApiSchema.bind(this);
        this.getApiConfig = this.getApiConfig.bind(this);
        this.updateSchema = this.updateSchema.bind(this);
    }

    getRouter() {
        this.router.get(['/', '/echo'], (ctx, next) => {
            ctx.response.body = 'you are in api inventory now.';
        });
        this.router.get('/list', this.list);
        this.router.post('/register', commonBodyParser, this.register);
        this.router.post('/update', commonBodyParser, this.update);
        this.router.post('/remove', commonBodyParser, this.remove);
        this.router.post('/updateschema', commonBodyParser, this.updateSchema);
        this.router.post('/config', commonBodyParser, this.config);
        this.router.post('/updateconfig', commonBodyParser, this.updateConfig);
        this.router.post('/removeconfig', commonBodyParser, this.removeConfig);
        this.router.post('/getapischema', commonBodyParser, this.getApiSchema);
        this.router.post('/getapiconfig', commonBodyParser, this.getApiConfig);

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

            let appDesc = await this.getAppConfig(appId);
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

                apis = apis.sort(apiSorter);

                ctx.response.body = errCode.success(apis);
            }
        }

        await next();
    }

    async register(ctx, next) {
        let apiData = ctx.request.body;
        // validate
        var valid = apiSchemaValidate(apiData);
        if (!valid) {
            ctx.response.status = 400;
            ctx.response.body = apiSchemaValidate.errors;
            return await next();
        }

        let appDesc = await this.getAppConfig(apiData.appId);
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
            method: apiData.method,
            appId: apiData.appId
        };
        let baseKey = `${ cacheKeys.apiInventory }:${ appDesc.name }`

        let hashKey = apiSketch.path.replace(/\//g, '_');
        if (hashKey.indexOf('_') === 0) {
            hashKey = hashKey.substr(1);
        }
        if (hashKey.lastIndexOf('_') === hashKey.length - 1) {
            hashKey = hashKey.substring(0, hashKey.length - 1)
        }

        let ok = await redisClient.hsetAsync(baseKey, hashKey, JSON.stringify(apiSketch)) >= 0;
        if (!ok) {
            ctx.response.body = errCode.dbErr();
        } else if (apiData.schema) {
            let cacheKey = `${ baseKey }:${ id }_schema`
            ok = await redisClient.setAsync(cacheKey, JSON.stringify(apiData.schema)) === 'OK';
            if (ok) {
                apiData.apiId = id;
                ctx.response.body = errCode.success(apiData);
            } else {
                ctx.response.body = errCode.dbErr();
            }
        }

        await next();
    }

    async update(ctx, next) {
        let apiData = ctx.request.body;

        // validate
        var valid = apiSchemaValidate(apiData);
        if (!valid) {
            ctx.response.status = 400;
            ctx.response.body = apiSchemaValidate.errors;
            return await next();
        } else if (!apiData.apiId) {
            ctx.response.status = 400;
            ctx.response.body = "apiId is missing..";
            return await next();
        }

        let appDesc = await this.getAppConfig(apiData.appId);
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
            method: apiData.method,
            appId: apiData.appId
        };
        ok = await redisClient.hsetAsync(baseKey, apiId, JSON.stringify(apiSketch)) >= 0;
        if (!ok) {
            ctx.response.body = errCode.dbErr();
        } else if (apiData.schema) {
            let cacheKey = `${ baseKey }:${ apiId }_schema`
            ok = await redisClient.setAsync(cacheKey, JSON.stringify(apiData.schema)) === 'OK';
            if (ok) {
                ctx.response.body = errCode.success(apiData);
            } else {
                ctx.response.body = errCode.dbErr();
            }
        }

        await next();
    }

    async remove(ctx, next) {
        let arg = ctx.request.body;
        if (!arg.appId || !arg.id) {
            ctx.response.status = 400;
            ctx.response.body = "appId or id is missing.";
            return await next();
        }

        let appDesc = await this.getAppConfig(arg.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

        // remove app sketch
        let baseKey = `${ cacheKeys.apiInventory }:${ appDesc.name }`
        let ok = await redisClient.hdelAsync(baseKey, arg.id) > 0;
        if (!ok) {
            ctx.response.body = errCode.success();
            return await next();
        }

        // remove schema
        let cacheKey = `${ baseKey }:${ apiId }_schema`
        ok = await redisClient.delAsync(cacheKey) >= 0;
        if (ok) {
            ctx.response.body = errCode.success(arg);
        } else {
            ctx.response.body = errCode.dbErr();
        }

        // remove cofig
        let pathKey = appDesc.path.replace(/\//g, '_');
        if (pathKey.indexOf('_') === 0) {
            pathKey = pathKey.substr(1);
        }
        if (pathKey.lastIndexOf('_') === pathKey.length - 1) {
            pathKey = pathKey.substring(0, pathKey.length - 1)
        }

        let cacheKey = `${ cacheKeys.apiInventory }:${ appDesc.name }:${ pathKey }`
        let ok = await redisClient.delAsync(cacheKey) >= 0;
        if (ok) {
            ctx.response.body = errCode.success();
        } else {
            ctx.response.body = errCode.dbErr();
        }

        await next();
    }

    async updateSchema(ctx, next) {        
        let apiData = ctx.request.body;
        // validate
        var valid = apiSchemaValidate(apiData);
        if (!apiData.appId || apiData.appId === 0 || !apiData.apiId || apiData.apiId === 0) {
            ctx.response.status = 400;
            ctx.response.body = apiSchemaValidate.errors;
            return await next();
        }

        let appDesc = await this.getAppConfig(apiData.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }
        
        let baseKey = `${ cacheKeys.apiInventory }:${ appDesc.name }`
        let cacheKey = `${ baseKey }:${ apiData.apiId }_schema`
        let ok = await redisClient.setAsync(cacheKey, JSON.stringify(apiData.schema)) === 'OK';
        if (ok) {
            ctx.response.body = errCode.success(apiData);
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

        let appDesc = await this.getAppConfig(apiConfig.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }

        let pathKey = apiConfig.path.replace(/\//g, '_');
        if (pathKey.indexOf('_') === 0) {
            pathKey = pathKey.substr(1);
        }
        if (pathKey.lastIndexOf('_') === pathKey.length - 1) {
            pathKey = pathKey.substring(0, pathKey.length - 1)
        }

        let cacheKey = `${ cacheKeys.apiInventory }:${ appDesc.name }:${ pathKey }`
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
        } else if (!apiConfig.apiId) {            
            ctx.response.status = 400;
            ctx.response.body = "apiId missing.";
            return await next();
        }

        let appDesc = await this.getAppConfig(apiConfig.appId);
        if (!appDesc) {
            ctx.response.body = errCode.resNotFound();
            return await next();
        }
        
        let pathKey = apiConfig.path.replace(/\//g, '_');
        if (pathKey.indexOf('_') === 0) {
            pathKey = pathKey.substr(1);
        }
        if (pathKey.lastIndexOf('_') === pathKey.length - 1) {
            pathKey = pathKey.substring(0, pathKey.length - 1)
        }

        let cacheKey = `${ cacheKeys.apiInventory }:${ appDesc.name }:${ pathKey }`
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

        let appDesc = await this.getAppConfig(apiConfig.appId);
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

        let pathKey = apiSketch.path.replace(/\//g, '_');
        if (pathKey.indexOf('_') === 0) {
            pathKey = pathKey.substr(1);
        }
        if (pathKey.lastIndexOf('_') === pathKey.length - 1) {
            pathKey = pathKey.substring(0, pathKey.length - 1)
        }

        let cacheKey = `${ cacheKeys.apiInventory }:${ appDesc.name }:${ pathKey }`
        let ok = await redisClient.delAsync(cacheKey) >= 0;
        if (ok) {
            ctx.response.body = errCode.success();
        } else {
            ctx.response.body = errCode.dbErr();
        }

        await next();
    }

    async getApiSchema(ctx, next) {
        let apiData = ctx.request.body;

        // validate
        // var valid = registerValidate(apiData);
        // if (!valid) {
        //     ctx.response.status = 400;
        //     ctx.response.body = registerValidate.errors;
        //     return await next();
        // }

        let baseKey = `${ cacheKeys.apiInventory }:${ apiData.appName }`

        let cacheKey = `${ baseKey }:${ apiData.apiId }_schema`
        let apiSchemaJson = await redisClient.getAsync(cacheKey);
        if (!apiSchemaJson) {
            ctx.response.body = errCode.dbErr();
            return await next();
        } else {
            try {
                let apiSchema = JSON.parse(apiSchemaJson);
                ctx.response.body = errCode.success(apiSchema);

            } catch (error) {
                logger.error(error);
                ctx.response.body = errCode.dbErr();
            }
        }

        await next();
    }
    
    async getApiConfig(ctx, next) {
        let apiData = ctx.request.body;

        // validate
        // var valid = registerValidate(apiData);
        // if (!valid) {
        //     ctx.response.status = 400;
        //     ctx.response.body = registerValidate.errors;
        //     return await next();
        // }

        let baseKey = `${ cacheKeys.apiInventory }:${ apiData.appName }`
              
        let pathKey = apiData.path.replace(/\//g, '_');
        if (pathKey.indexOf('_') === 0) {
            pathKey = pathKey.substr(1);
        }
        if (pathKey.lastIndexOf('_') === pathKey.length - 1) {
            pathKey = pathKey.substring(0, pathKey.length - 1)
        }

        let cacheKey = `${ baseKey }:${ pathKey }`
        let apiConfigJson = await redisClient.getAsync(cacheKey);
        if (!apiConfigJson) {
            ctx.response.body = errCode.dbErr();
            return await next();
        } else {
            try {
                let apiConfig = JSON.parse(apiConfigJson);
                ctx.response.body = errCode.success(apiConfig);

            } catch (error) {
                logger.error(error);
                ctx.response.body = errCode.dbErr();
            }
        }

        await next();
    }

    async getAppConfig(appId) {
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

function apiSorter(a, b) {
    return a.apiId - b.apiId
}

exports = module.exports = new Steward();