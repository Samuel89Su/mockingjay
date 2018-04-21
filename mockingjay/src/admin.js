'use strict'

const Router = require('koa-router')
const bodyParser = require('./common/bodyParser')

const pswKey = 'gmib4p+|2^z%;*:=~o.<*n<q`<9.@,tc'

module.exports.bindRoutes = bindRoutes

function bindRoutes(router, prefixPath) {
    prefixPath = prefixPath || ''
    router.post(prefixPath + '/login', bodyParser, login)
    router.post(prefixPath + '/logout', logout)
}

async function login(ctx, next) {
    // unlogin
    if (!ctx.session.userId) {
        if (ctx.request.body.userName && ctx.request.body.psw) {
            ctx.session.userId = 1
            ctx.status = 200
            ctx.body = {
                code: 0,
                data: true
            }
        } else {
            ctx.status = 401
        }
    } else {
        ctx.body = {
            code: 0,
            data: true
        }
    }
    return
}

async function logout(ctx, next) {
    if (ctx.session) {
        ctx.session = null
    }
    ctx.set('location', '/login')
    ctx.status = 302
    return
}