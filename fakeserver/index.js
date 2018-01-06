'use strict';

const Koa = require('koa');
const Router = require('koa-router');

const router = new Router();
router.all('/*', (ctx, next) => {
    ctx.body = "you are in fake server now.";
});

const app = new Koa();

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3100, () => {
    console.log('listening on 3100');
});