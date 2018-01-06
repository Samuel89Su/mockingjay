'use strict';

const Router = require('koa-router');
const redisClient = require('../common/redisClient');
const cacheKeys = require('../common/cacheKeys');
const logger = require('../common/logger');
const errCode = require('./errCode');
const bodyParser = require('../common/bodyParser');

class steward {
    constructor(arg) {
        this.router = new Router();
    }

    getRouter() {
        this.router.get(['/', '/echo'], (ctx, next) => {
            ctx.response.body = 'you are in app inventory now.';
        });
        this.router.get('/list', this.list);
        this.router.post('/register', bodyParser, this.register);
        this.router.post('/update', bodyParser, this.update);

        return this.router;
    }

    // fetch app list
    async list(ctx, next) {

        let keyPattern = `${cacheKeys.appInventory}:*`
        let keys = await redisClient.keysAsync(keyPattern);
        let apps = [];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let appDesc = await redisClient.getAsync(key);
            apps.push(JSON.parse(appDesc));
        }

        ctx.response.body = apps;
        await next();
    };

    // register app
    async register(ctx, next) {
        //TODO: validate body json schema

        let appDesc = ctx.request.body;
        if (!appDesc.name) {
            ctx.response.status = 400;
            ctx.response.body = 'app name CAN NOT be null or empty';
        } else {
            // generate id
            let id = await redisClient.incrAsync(cacheKeys.appId);
            appDesc.id = id;
            let key = `${cacheKeys.appInventory}:${appDesc.id}`

            // set/update cache
            let ok = await redisClient.setAsync(key, JSON.stringify(appDesc)) === 'OK';
            if (ok) {
                ctx.response.body = {
                    code: 0,
                    msg: 'ok',
                    data: appDesc
                };
            } else {
                ctx.response.body = {
                    code: errCode.dbErr,
                    msg: 'cache err',
                    data: null
                };
            }
        }

        await next();
    };

    //  update app desc
    async update(ctx, next) {
        //TODO: validate body json schema

        let appDesc = ctx.request.body;
        if (!appDesc.name) {
            ctx.response.status = 400;
            ctx.response.body = 'app name CAN NOT be null or empty';
        } else if (!appDesc.id) {
            ctx.response.status = 400;
            ctx.response.body = 'app id CAN NOT be null or 0';
        } else {
            let idMax = await redisClient.getAsync(cacheKeys.appId);
            if (appDesc.id > parseInt(idMax)) {
                ctx.response.body = {
                    code: errCode.resNotFound.code,
                    msg: errCode.resNotFound.defaultMsg,
                    data: null
                };
            } else {
                let key = `${ cacheKeys.appInventory }:${ appDesc.id }`

                // set/update cache
                let ok = await redisClient.setAsync(key, JSON.stringify(appDesc)) === 'OK';
                if (ok) {
                    ctx.response.body = {
                        code: 0,
                        msg: 'ok',
                        data: appDesc
                    };
                } else {
                    ctx.response.body = {
                        code: errCode.dbErr,
                        msg: 'cache err',
                        data: null
                    };
                }
            }
        }

        await next();
    }
}

exports = module.exports = new steward();