'use strict';

const Router = require('koa-router');
const logger = require('../common/logger');
const broker = require('./broker');

const router = new Router();

router.all('/api/*', broker.broke);

exports = module.exports = router;