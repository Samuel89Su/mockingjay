'use strict'

module.exports = Authorization

function Authorization(options) {
    return async function Authorize(ctx, next) {
        try {
            let lowerPath = ctx.path.toLowerCase()
            if (lowerPath.startsWith('/mocking') || lowerPath.startsWith('weshrimpball')) {
                await next()
            } else if (!lowerPath.includes('login')) {
                // check auth
                if (!ctx.session.userId || ctx.session.userId === 0) {
                    ctx.status = 302
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