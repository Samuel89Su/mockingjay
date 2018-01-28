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


router.get('/index', async ctx => {
    await nextApp.render(ctx.req, ctx.res, '/index', ctx.query)
    ctx.respond = false
    // ctx.status = 200
})

router.get('/a', async ctx => {
    await nextApp.render(ctx.req, ctx.res, '/b', ctx.query)
    ctx.respond = false
    // ctx.status = 200
})

router.get('/b', async ctx => {
    await nextApp.render(ctx.req, ctx.res, '/a', ctx.query)
    ctx.respond = false
    // ctx.status = 200
})

router.use('*', async (ctx, next) => {
    console.log(ctx.path)
})

exports = module.exports = router