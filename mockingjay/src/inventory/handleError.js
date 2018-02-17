'use strict'

const logger = require('../common/logger')

async function handleError (ctx, next) {
    try {
        await next()
    } catch (error) {
        logger.error({
            message: error.message,
            stack: error.stack
        })
    } finally {
    }
}

exports = module.exports = handleError