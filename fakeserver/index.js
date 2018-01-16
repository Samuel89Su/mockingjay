'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');

const bodyParser = BodyParser({
  enableTypes: ['json', 'form', 'text'],
  onerror: function (err, ctx) {
      console.log(err)
  }
});

const router = new Router();
router.use('/*', bodyParser)
router.all('/*', (ctx, next) => {
    console.log(ctx.request.body);
    ctx.body = "you are in fake server now.";
});

const app = new Koa();

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3100, () => {
    console.log('listening on 3100');
});
