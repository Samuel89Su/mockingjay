'use strict'

const Router = require('koa-router')
const appSteward = require('./appSteward')
const apiSteward = require('./apiSteward')
const handleError = require('./handleError')

const router = new Router()

router.use('/*', handleError)

// register app inventory routes
const appRouter = appSteward.getRouter()
router.use('/app', appRouter.routes(), appRouter.allowedMethods())

// register api inventory routes
const apiRouter = apiSteward.getRouter()
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())


exports = module.exports = router