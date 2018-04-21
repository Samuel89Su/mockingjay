'use strict'

const Router = require('koa-router')
const appSteward = require('./appSteward')
const apiSteward = require('./apiSteward')

module.exports.bindRoutes = bindRoutes;

function bindRoutes(router, prefixPath) {
    prefixPath = prefixPath || ''

    appSteward.bindRoutes(router, prefixPath + '/app')

    apiSteward.bindRoutes(router, prefixPath + '/api')
}