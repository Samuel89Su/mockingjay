'use strict';

const redisClient = require('../common/redisClient');
const cacheKeys = require('../common/cacheKeys');
const logger = require('../common/logger');
const requestLogger = require('../common/requestLogger');
const mocking = require('./mocking');
const forward = require('./forward');

class Broker {
    constructor(arg) {
        this.set404 = this.set404.bind(this);
    };

    async broke(ctx, next) {
        let subPaths = ctx.path.split('/').slice(1);
        if (subPaths.length < 4) {
            await set404(ctx);
            return await next();
        } else {
            let app = subPaths[2];
            let apiPath = subPaths.slice(3).join('_');

            // validate request schema at first
            

            let cacheKey = cacheKeys.apiInventory + ':' + app + ':' + apiPath;
            let apiConfigCache = await redisClient.getAsync(cacheKey);
            if (!apiConfigCache) {
                await set404(ctx);
                return await next();
            }
            let apiConfig = JSON.parse(apiConfigCache);
            apiConfigCache = null;

            if (!apiConfig) {
                await set404(ctx);
                return await next();
            }
            if ((!apiConfig.method && ctx.method !== 'GET') || apiConfig.method !== ctx.method) {
                ctx.status = 405;
                ctx.body = 'Method Not Allowed';
                return await next();
            }

            // forward or mock
            if (!apiConfig.mock) {
                let appCfgCache = await redisClient.getAsync(`${ cacheKeys.appInventory }:${ apiConfig.appId }`);
                let appCfg = JSON.parse(appCfgCache);
                appCfgCache = null;

                if (apiConfig.proxyCfg && apiConfig.proxyCfg.bypass) {
                    // forward request
                    let resOpts = await forward(ctx.request, appCfg, apiConfig);
                    ctx.response.set(resOpts.headers);
                    ctx.body = resOpts.body;
                }
            } else {
                // mocking
                await mocking(ctx, apiConfig);
            }
        }

        await next();
    }

    set404(ctx) {
        ctx.status = 404;
        ctx.body = 'api not found';
    }
}



exports = module.exports = new Broker();