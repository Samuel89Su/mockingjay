'use strict'

const errCode = require('../inventory/errCode')
const logger = require('../common/logger')

async function handleError (ctx, next) {
    try {
        await next()
    } catch (error) {
        logger.error({
            message: error.message,
            stack: error.stack
        })

        ctx.response.body = errCode.internalErr({
            message: error.message,
            stack: error.stack
        })

    } finally {
    }
}

exports = module.exports = handleError