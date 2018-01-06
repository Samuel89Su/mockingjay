'use strict';

const Router = require('koa-router');
const bodyParser = require('../common/bodyParser');
const logger = require('../common/logger');
const appSteward = require('./appSteward');
const apiSteward = require('./apiSteward');

const router = new Router();

// register app inventory routes
const appRouter = appSteward.getRouter();
router.use('/app', appRouter.routes(), appRouter.allowedMethods());

// register api inventory routes
const apiRouter = apiSteward.getRouter();
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());


exports = module.exports = router;