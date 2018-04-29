'use strict'

const Router = require('koa-router')
const bodyParser = require('./common/bodyParser')
const crypto = require('crypto')
const CacheFacade = require('./common/CacheFacade')

const pswKey = 'gmib4p+|2^z%;*:=~o.<*n<q`<9.@,tc'

module.exports.bindRoutes = bindRoutes

function bindRoutes(router, prefixPath) {
    prefixPath = prefixPath || ''
    router.post(prefixPath + '/login', bodyParser, login)
    router.post(prefixPath + '/logout', logout)
    router.post(prefixPath + '/signup', bodyParser, signup)
    router.post(prefixPath + '/searchUser', bodyParser, searchUser)
}

async function login(ctx, next) {
    if (!ctx.session.userId) {
        if (!ctx.request.body.userName || !ctx.request.body.psw) {
            ctx.body = {
                code: 401,
                msg: 'invalid userName or password'
            }
            ctx.status = 200
            return
        } else {
            let args = ctx.request.body
            // retrieve psw and verify
            let user = await CacheFacade.getUser(args.userName, 0)
            if (!user || !user.id) {
                ctx.body = {
                    code: 401,
                    msg: 'user is NOT exists'
                }
                ctx.status = 200
                return
            }

            let md5 = crypto.createHash('md5')
            md5.update(user.psw + pswKey)
            let cooktail = md5.digest('hex')
            if (cooktail != ctx.request.body.psw) {
                ctx.body = {
                    code: 401,
                    msg: 'password is NOT cerrect'
                }
                ctx.status = 200
                return
            } else {
                ctx.session.userId = user.id
                ctx.session.userName = user.name
                ctx.status = 200
                ctx.body = {
                    code: 0,
                    data: true
                }
            }
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

/**
 * signup a new user
 * @param {*} ctx 
 * @param {*} next 
 */
async function signup(ctx, next) {
    if (!ctx.request.body.userName || !ctx.request.body.psw) {
        ctx.body = {
            code: 401,
            msg: 'invalid userName or password'
        }
        ctx.status = 200
        return
    }
    let user = ctx.request.body
    user.name = user.userName
    delete user.userName
    user.id = 0
    let ok = await CacheFacade.setUser(user)
    ctx.body = {
        code: 0,
        data: ok
    }
}

async function searchUser(ctx, next) {
    if (!ctx.request.body.userName) {
        ctx.body = {
            code: 401,
            msg: 'invalid userName'
        }
        ctx.status = 200
        return
    }
    let users = await CacheFacade.searchUserByUserName(ctx.request.body.userName, 0)
    ctx.body = {
        code: 0,
        data: users
    }
}