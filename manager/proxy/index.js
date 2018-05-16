'use strict'

const Proxy = require('./lib/index').Proxy
const {
    URL
} = require('url')
const queryString = require('query-string')
const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const config = require('./configMgr').loadConfig()
const eventEmitter = require('./eventEmitter')
const localMock = require('./localMock')

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
                                    let hostName = config.domain || config.lanIP
                                    let redirectHost = (port !== 80 ? `${hostName}:${port}` : hostName)
                                    query[key] = fromurl.replace(redirectUrl.host, redirectHost)
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
            try {
                eventEmitter.emit('proxyEvent', JSON.stringify({
                    originalUrl: req.url,
                    targetUrl: "",
                    status: proxyRes.statusCode
                }))
            } catch (error) {
            }
        }
    }
}

function getOpts(env) {
    config.onProxyReq = onProxyReq
    if (!env || env !== 'production') {
        config.onProxyRes = getProxyResHandler()
    }

    return config
}

exports = module.exports = function createProxy(env) {
    return [localMock, Proxy(config.context, getOpts(env))]
}