'use strict';

const Router = require('koa-router');
const broker = require('./broker');

const router = new Router();

router.use('/*', broker)
router.all('/*', async function (ctx, next) {
    return await next();
});

exports = module.exports = router;