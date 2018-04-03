'use strict'

const Proxy = require('../lib/index').Proxy
const {
    URL
} = require('url')
const queryString = require('query-string')
const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const config = require('./configMgr').loadConfig()
const eventEmitter = require('./eventEmitter')

const targetHost = new URL(config.target).host
const port = config.port

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

        // emit event
        if (eventEmitter) {
            eventEmitter.emit('proxyEvent', JSON.stringify({
                originalUrl: req.url,
                doProxy: true,
                target: req.target,
                status: proxyRes.statusCode
            }))
        }
    }
}

function getOpts() {
    config.onProxyReq = onProxyReq
    config.onProxyRes = getProxyResHandler()
    config.eventEmitter = eventEmitter

    return config
}

exports = module.exports = function createProxy() {
    return Proxy(config.context, getOpts())
}