'use strict';

const Koa = require('koa');
const serve = require('koa-static');
const router = require('./router');
const logger = require('./src/components/common/logger');

const app = new Koa();
app.env = 'dev';

app.use(router.routes())
    .use(router.allowedMethods());

app.use(serve(__dirname + '/appRoot'));

app.listen(3000, () => {
    logger.info('listening on 3000');
});