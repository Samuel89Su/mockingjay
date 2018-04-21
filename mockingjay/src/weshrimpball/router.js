'use strict'

const Router = require('koa-router')
const verifyWeChatSign = require('./verifySign')
const receiveMessage = require('./messageReceiver')

module.exports.bindRoutes = bindRoutes;

function bindRoutes(router, prefixPath) {
    prefixPath = prefixPath || ''


    router.get(prefixPath + '/', verifyWeChatSign)
    router.post(prefixPath + '/', receiveMessage)
}