'use strict'

const Router = require('koa-router')
const commonBodyParser = require('../common/bodyParser')
const handleError = require('../common/handleError')
const verifyWeChatSign = require('./verifySign')
const receiveMessage = require('./messageReceiver')

const router = new Router()

router.use('/', handleError)

router.get('/', verifyWeChatSign)
router.post('/', receiveMessage)

exports = module.exports = router