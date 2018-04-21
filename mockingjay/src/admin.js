'use strict'

const Router = require('koa-router')
const bodyParser = require('./common/bodyParser')

module.exports.bindRoutes = bindRoutes

function bindRoutes(router) {
    router.post('/login', bodyParser, login)
    router.post('/logout', logout)
}

async function login(ctx, next) {
    // unlogin
    if (!ctx.session.userId) {
        if (ctx.request.body.userName && ctx.request.body.psw) {
            ctx.session.userId = 1
            ctx.status = 200
            ctx.body = {
                code: 0,
                data: null
            }
        } else {
            ctx.status = 403
        }
    } else {
        ctx.body = {
            code: 0,
            data: null
        }
    }
    return
}

async function logout(ctx, next) {
    if (ctx.session) {
        ctx.session = null
    }
    ctx.status = 302
    ctx.set('location', '/login')
    return
}