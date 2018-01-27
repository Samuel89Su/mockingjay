const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = new Koa()
        const router = new Router()      

        router.get('/inventory/*', async (ctx, next) => {
            ctx.body = 'this is api inventory.'
            await next()
        })

        router.get('/index', async ctx => {
            await app.render(ctx.req, ctx.res, '/index', ctx.query)
            ctx.respond = false
          })

        router.get('/a', async ctx => {
          await app.render(ctx.req, ctx.res, '/b', ctx.query)
          ctx.respond = false
        })
      
        router.get('/b', async ctx => {
          await app.render(ctx.req, ctx.res, '/a', ctx.query)
          ctx.respond = false
        })
      
        // router.get('/*', async ctx => {
        //   await handle(ctx.req, ctx.res)
        //   ctx.respond = false
        // })
      
        router.use('/*', async (ctx, next) => {
          ctx.res.statusCode = 200
          await next()
        })
      
        server.use(router.routes())
        server.listen(3300, (err) => {
          if (err) throw err
          console.log(`> Ready on http://localhost:3300`)
        })
    })