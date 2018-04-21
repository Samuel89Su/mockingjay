'use strict'

const Router = require('koa-router')
const send = require('koa-send')
const brokerRouter = require('./broker/router')
const inventoryRouter = require('./inventory/router')
const weShrimpballRouter = require('./weshrimpball/router')
const Authorization = require('./Middlewares/Authorization')
const admin = require('./admin')
const handleError = require('./common/handleError')

const router = new Router()

router.use('/', handleError, Authorization())

admin.bindRoutes(router)

// register mocking module routes
brokerRouter.bindRoutes(router, '/mocking')
// router.use('/mocking', brokerRouter.routes(), brokerRouter.allowedMethods())

// register api inventory module routes
inventoryRouter.bindRoutes(router, '/inventory')
// router.use('/inventory', inventoryRouter.routes(), inventoryRouter.allowedMethods())

weShrimpballRouter.bindRoutes(router, '/weshrimpball')
// router.use('/weshrimpball', weShrimpballRouter.routes(), weShrimpballRouter.allowedMethods())

const regexp = /.(js|css)$/i
const htmlRegexp = /.(html|htm)$/i
router.get(/^\/(index|app|api|weshrimpball)/i, async (ctx, next) => {
    if (/^\/(index).(htm|html)/i.test(ctx.path)) {
        ctx.set('location', '/')
        ctx.status = 302
        return
    }
    // filter resource file
    else if (regexp.test(ctx.path) && !htmlRegexp.test(ctx.path)) {
        await next()
    } else {
        await send(ctx, 'index.html', {
            root: __dirname + '/static'
        })
    }
})

exports = module.exports = router