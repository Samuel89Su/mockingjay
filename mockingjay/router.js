'use strict'

const Router = require('koa-router')
const send = require('koa-send')
const brokerRouter = require('./src/broker/router')
const inventoryRouter = require('./src/inventory/router')

const router = new Router()

// register mocking module routes
router.use('/mocking', brokerRouter.routes(), brokerRouter.allowedMethods())

// register api inventory module routes
router.use('/inventory', inventoryRouter.routes(), inventoryRouter.allowedMethods())

const regexp = /.(js|css)$/i
const htmlRegexp = /.(html|htm)$/i
router.get(/^\/(app|api)/i, async (ctx, next) => {
    // filter resource file
    if (regexp.test(ctx.path) && !htmlRegexp.test(ctx.path)) {
        await next()
    } else {
        await send(ctx, 'index.html', { root: __dirname + '/static' })
    }
})

exports = module.exports = router