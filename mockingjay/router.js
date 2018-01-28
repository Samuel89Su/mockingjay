'use strict'

const Router = require('koa-router')
const brokerRouter = require('./src/components/broker/router')
const inventoryRouter = require('./src/components/inventory/router')
const nextApp = require('./nextApp')

const router = new Router()

// register mocking module routes
router.use('/mocking', brokerRouter.routes(), brokerRouter.allowedMethods())

// register api inventory module routes
router.use('/inventory', inventoryRouter.routes(), inventoryRouter.allowedMethods())

router.get('/', async (ctx, next) => {
    await nextApp.render(ctx.req, ctx.res, '/index', ctx.query)
    ctx.respond = false
    ctx.res.statusCode = 200
})

const reservePattern = new RegExp('^/(index|mocking|inventory)', 'i')
router.all('/*', async (ctx, next) => {
    if (!reservePattern.test(ctx.path)) {
        await nextApp.render(ctx.req, ctx.res, ctx.path, ctx.query)
        ctx.respond = false
        ctx.res.statusCode = 200
    } else {
        await next()
    }
})

exports = module.exports = router