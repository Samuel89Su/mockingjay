'use strict'

module.exports = Authorization

function Authorization(options) {
    return async function Authorize(ctx, next) {
        try {
            let lowerPath = ctx.path.toLowerCase()
            if (lowerPath.startsWith('/mocking') || lowerPath.startsWith('weshrimpball')) {
                await next()
            } else if (!(lowerPath.includes('login') || lowerPath.includes('logout') || lowerPath.includes('signup'))) {
                // check auth
                if (!ctx.session.userId || ctx.session.userId === 0) {
                    ctx.body = { code: 302 }
                    ctx.set('location', '/login')
                    return
                } else {
                    await next()
                }
            } else {
                await next()
            }
        } catch (error) {
        }
    }
}