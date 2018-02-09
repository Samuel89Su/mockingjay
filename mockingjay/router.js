'use strict'

const Router = require('koa-router')
const send = require('koa-send')
const brokerRouter = require('./src/components/broker/router')
const inventoryRouter = require('./src/components/inventory/router')

const router = new Router()

// register mocking module routes
router.use('/mocking', brokerRouter.routes(), brokerRouter.allowedMethods())

// register api inventory module routes
router.use('/inventory', inventoryRouter.routes(), inventoryRouter.allowedMethods())

router.get(/^\/(app|api)/i, async (ctx, next) => {
    // filter resource file
    if (ctx.path) {
        await next()
    }
    await send(ctx, 'index.html', { root: __dirname + '/static' })
})

exports = module.exports = router