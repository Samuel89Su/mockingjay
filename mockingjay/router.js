'use strict'

const Router = require('koa-router')
const brokerRouter = require('./src/components/broker/router')
const inventoryRouter = require('./src/components/inventory/router')
const nextApp = require('./nextApp')

const pages = ['/index', '/appdetails', '/b']

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

const ignorePattern = new RegExp('^/(components|middlewares|reducers|utils)', 'i')
router.all(/^\/(components|middlewares|reducers|utils)/i, async (ctx, next) => {
    ctx.res.statusCode = 404
})

const apiPattern = new RegExp('^/(mocking|inventory)')
router.use('/mocking', async (ctx, next) => {
    console.log('hit api: ' + ctx.path)
})
router.use('/inventory', async (ctx, next) => {
    console.log('hit api: ' + ctx.path)
})

router.get('/', async (ctx, next) => {
    await nextApp.render(ctx.req, ctx.res, '/index', ctx.query)
    ctx.respond = false
    ctx.res.statusCode = 200
})

pages.forEach(page => {
    router.get(page, renderPage)
})

// router.get('/appdetails', async (ctx, next) => {
//     await nextApp.render(ctx.req, ctx.res, '/appdetails', ctx.query)
//     ctx.respond = false
//     ctx.res.statusCode = 200
// })

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

async function renderPage (ctx, next) {
    await nextApp.render(ctx.req, ctx.res, ctx.path, ctx.query)
    ctx.respond = false
    ctx.res.statusCode = 200
}

exports = module.exports = router