'use strict'

const proxy = require('../lib')
const {
    URL
} = require('url')
const queryString = require('query-string')
const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const cfg = require('../defaultConfig')
const configFactory = require('../lib/config-factory')
const contextMatcher = require('../lib/context-matcher')
const Router = require('../lib/router')
const eventEmitter = require('./eventEmitter')

const targetHost = new URL(cfg.target).host
const port = cfg.port

function onProxyReq(proxyReq, req, res) {}

function getProxyResHandler() {
    return function onProxyRes(proxyRes, req, res) {
        // overwrite redirect response location
        if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
            let location = proxyRes.headers.location
            if (location) {
                let hasSearch = location.indexOf('?')
                if (hasSearch > -1) {
                    let search = location.substr(hasSearch)
                    let query = queryString.parse(search)
                    for (const key in query) {
                        if (key.toLowerCase() === 'fromurl') {
                            const fromurl = query[key];
                            if (fromurl) {
                                let redirectUrl = new URL(fromurl)
                                let segs = targetHost.split('.').reverse()
                                let domain = segs.pop() + '.' + segs.pop()
                                if (redirectUrl.host.indexOf(domain) > -1) {
                                    query[key] = fromurl.replace(redirectUrl.host, 'localhost:' + port)
                                    proxyRes.headers.location = proxyRes.headers.location.replace(search, '?' + queryString.stringify(query))
                                }
                            }
                            break
                        }
                    }
                }
            }
        }

        if (eventEmitter) {
            eventEmitter.emit('proxyEvent', JSON.stringify({
                originalUrl: req.url,
                status: proxyRes.statusCode
            }))
        }
    }
}

function getOpts() {
    cfg.onProxyReq = onProxyReq
    cfg.onProxyRes = getProxyResHandler()

    return cfg
}

exports = module.exports = function createProxy() {
    return proxy(cfg.context, getOpts())
}