'use strict'

/**
 * get next pages routes.
 * @param next app.
 * @param router.
 */
function setupPagesRoutes(app, router) {

    router.get('/index', async ctx => {
        await app.render(ctx.req, ctx.res, '/index', ctx.query)
        ctx.respond = false
        ctx.status = 200
    })

    router.get('/a', async ctx => {
        await app.render(ctx.req, ctx.res, '/b', ctx.query)
        ctx.respond = false
        ctx.status = 200
    })

    router.get('/b', async ctx => {
        await app.render(ctx.req, ctx.res, '/a', ctx.query)
        ctx.respond = false
        ctx.status = 200
    })
}

exports = module.exports = setupPagesRoutes