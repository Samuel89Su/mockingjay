'use strict'

const Koa = require('koa')
// const serve = require('koa-static')
const router = require('./router')
const nextApp = require('./nextApp')
const setupPagesRoutes = require('./pages/setupPagesRoutes')
const logger = require('./src/components/common/logger')
const Router = require('koa-router')

// server.use(serve(__dirname + '/appRoot'))

nextApp.prepare()
    .then(() => {
        
        // setupPagesRoutes(nextApp, apiRouter)

        
        const server = new Koa()
        server.env = process.env.NODE_ENV !== 'production' ? 'dev' : 'production'
        
        server.use(router.routes())
            .use(router.allowedMethods())

        server.listen(3000, (err) => {
            if (err) {
                throw err
            }
            logger.info('listening on 3000')
            console.log('listening on 3000')
        });
    })