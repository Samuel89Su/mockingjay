'use strict';

const Router = require('koa-router');
const home = require('./src/home');

const mockingRouter = require('./src/components/broker/router');
const inventoryRouter = require('./src/components/inventory/router');

const router = new Router();

router.all(['/', '/home/*'], home);

// register mocking module routes
router.use('/mocking', mockingRouter.routes(), mockingRouter.allowedMethods());

// register api inventory module routes
router.use('/inventory', inventoryRouter.routes(), inventoryRouter.allowedMethods());

exports = module.exports = router;