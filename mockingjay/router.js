'use strict'

const Router = require('koa-router')
const brokerRouter = require('./src/components/broker/router')
const inventoryRouter = require('./src/components/inventory/router')
const nextApp = require('./nextApp')

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

router.redirect('/', '/index')

const handle = nextApp.getRequestHandler()
const reservePattern = new RegExp('^/(mocking|inventory)', 'i')
router.all('/*', async (ctx, next) => {
    if (reservePattern.test(ctx.path)) {
        await next()        
    } else {
        await handle(ctx.req, ctx.res)
        ctx.res.statusCode = 200
        ctx.respond = false
    }
})

exports = module.exports = router