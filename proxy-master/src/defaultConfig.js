'use strict'

const config = require('../config')

const defaultConfig = { // 代理配置， 参见 http-proxy-middleware
    ip: config.ip,
    domain: config.domain,
    port: config.port,
    context: ['/'],
    changeOrigin: true,
    staticRoot: config.static,
    fiddleAspRoute: false,
    target: config.target,
    router: {
    },
    regExpRoutes: [
    ],
    pathRewrite: {
    }
}

exports = module.exports = defaultConfig