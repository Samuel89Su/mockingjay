'use strict'

const Router = require('koa-router')
const handleError = require('../common/handleError')
const verifyWeChatSign = require('./verifySign')

const router = new Router()

router.use('/*', handleError)

router.get('/', verifyWeChatSign)

exports = module.exports = router