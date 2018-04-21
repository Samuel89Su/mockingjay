'use strict';

const Router = require('koa-router');
const broker = require('./broker');

module.exports.bindRoutes = bindRoutes;

function bindRoutes (router, prefixPath) {
    prefixPath = prefixPath || ''
    router.use(prefixPath + '/*', broker)
    router.all(prefixPath + '/*', async function (ctx, next) {
        return // await next();
    });
}