'use strict'

const proxy = require('http-proxy-middleware')
const createOpt = require('./defaultOpts')

exports = module.exports = function newProxy(port, eventEmitter) {
    let opts = createOpt('./static', port, eventEmitter)

    return proxy(opts.filter, opts.opts)
}