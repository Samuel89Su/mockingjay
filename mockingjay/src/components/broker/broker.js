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
        this.logRequest = this.logRequest.bind(this);
    };

    async broke(ctx, next) {
        let subPaths = ctx.path.split('/');
        if (subPaths.length < 3) {
            await this.set404(ctx);
        } else {
            let appName = subPaths[2];
            let apiPath = subPaths.slice(3).join('_');

            let baseKey = `${ cacheKeys.apiInventory }:${ appName }`;
            // retrieve sketch
            let apiSketch = await redisClient.hgetAsync(baseKey, apiPath);
            // unregistered api, return not found
            if (!apiSketch) {
                await this.set404(ctx);
            } else {
                apiSketch = JSON.parse(apiSketch);

                // method not allowed
                if (apiSketch.method !== ctx.method) {
                    ctx.status = 405;
                    ctx.body = 'Method Not Allowed';
                } else {
                    // validate request schema
                    if (apiSketch.validate) {
                        let schemaKey = `${ baseKey }:${ apiSketch.apiId }_schema`;
                        let apiSchema = await redisClient.getAsync(schemaKey);
                        if (apiSchema) {
                            apiSchema = JSON.parse(apiSchema);

                            let valid = false;
                            // TODO: request schema validation

                            if (valid) {
                                // forword
                                let appDescJson = await redisClient.getAsync(`${ cacheKeys.appInventory }:${ apiConfig.appId }`);
                                let appCfg = JSON.parse(appDescJson);
                                appDescJson = null;
                                if ((appCfg.apiForwardTarget && appCfg.targets && appCfg.targets[appCfg.apiForwardTarget]) ||
                                    apiSketch.forward) {
                                    // forward request
                                    var targetBaseUrl = appCfg.targets[appCfg.apiForwardTarget];
                                    // break & return                
                                    if (!targetBaseUrl) {
                                        ctx.status = 404;
                                        ctx.body = 'Target not found in cfg.';
                                    } else {
                                        let resOpts = await forward(ctx.request, targetBaseUrl, apiConfig.path);
                                        ctx.response.set(resOpts.headers);
                                        ctx.body = resOpts.body;
                                    }
                                }
                                // mock 
                                else {
                                    let cacheKey = `${ baseKey }:${ apiPath }`;
                                    let apiConfigJson = await redisClient.getAsync(cacheKey);
                                    if (!apiConfigJson) {
                                        await this.set404(ctx);
                                    } else {
                                        let apiConfig = JSON.parse(apiConfigJson);
                                        apiConfigJson = null;

                                        if (!apiConfig) {
                                            await this.set404(ctx);
                                        }
                                        // mocking 
                                        else if (apiConfig.mock) {
                                            await mocking(ctx, apiDescriptor.mockCfg);
                                        }
                                    }
                                }

                                // TODO: response schema validation
                                if (apiSketch.validate && ctx.status === 200) {

                                }
                            }
                        }
                    }
                }
            }
        }

        // logging
        await this.logRequest(ctx.request, ctx.response);
        await next();
    }

    set404(ctx) {
        ctx.status = 404;
        ctx.body = 'api not found';
    }

    logRequest(req, res) {
        requestLogger.info({
            request: {
                path: req.path,
                method: req.method,
                queryString: req.querystring,
                headers: req.headers,
                body: req.body
            },
            response: {
                headers: res.headers,
                body: res.body
            }
        });
    };
}



exports = module.exports = new Broker();