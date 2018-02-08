'use strict'

const Router = require('koa-router')
const brokerRouter = require('./src/components/broker/router')
const inventoryRouter = require('./src/components/inventory/router')

const router = new Router()

router.use('/', async (ctx, next) => {
    await next()
    if (ctx.status !== 200) {
        console.log(ctx.path + ':' + ctx.status)
    }
})

// register mocking module routes
router.use('/mocking', brokerRouter.routes(), brokerRouter.allowedMethods())

// register api inventory module routes
router.use('/inventory', inventoryRouter.routes(), inventoryRouter.allowedMethods())

exports = module.exports = router