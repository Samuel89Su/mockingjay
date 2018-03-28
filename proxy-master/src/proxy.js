'use strict'

const proxy = require('http-proxy-middleware')
const {
    URL
} = require('url')
const queryString = require('query-string')
const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const cfg = require('../defaultConfig')
const configFactory = require('http-proxy-middleware/lib/config-factory')
const contextMatcher = require('http-proxy-middleware/lib/context-matcher')
const Router = require('http-proxy-middleware/lib/router')

const opts = cfg.proxyOpts
const context = cfg.proxyOpts.context
delete cfg.proxyOpts.context

// extract regexp routes
const regExpRoutes = opts.regExpRoutes || []
delete opts.regExpRoutes

const xmlHttRequestTarget = opts.xmlHttRequestTarget
delete opts.xmlHttRequestTarget

const config = configFactory.createConfig(context, cfg.proxyOpts)

const targetHost = new URL(opts.target).host

function onProxyReq(proxyReq, req, res) {}

function getProxyResHandler(port, proxyEventEmitter) {
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

        if (proxyEventEmitter) {
            proxyEventEmitter.emit('proxyEvent', JSON.stringify({
                originalUrl: req.url,
                status: proxyRes.statusCode
            }))
        }
    }
}

function getFilter(proxyEventEmitter) {
    /**
     * @param {String} pathname
     * @param {Object} req
     * @return {Boolean}
     */
    return function filter(pathname, req) {
        let doProxy = true
        // by pass if local
        if (req.method === 'GET' || req.method === 'HEAD') {
            if (pathname.lastIndexOf('.') > pathname.lastIndexOf('/')) {
                let filePath = path.join(cfg.staticRoot, pathname)
                try {
                    let stats = fs.statSync(filePath)
                    if (stats.isFile()) {
                        doProxy = false
                    }
                } catch (error) {}
            } else if (cfg.fiddleAspRoute) {
                let parentDir = pathname.substr(0, pathname.lastIndexOf('/'))
                var files = fetchFiles(cfg.staticRoot + parentDir)
                if (files && files.length > 0) {
                    for (let i = 0; i < files.length; i++) {
                        const fileName = files[i].replace(/\\/g, '/')
                        let extension = fileName.substr(fileName.lastIndexOf('.'))
                        if (fileName.lastIndexOf(pathname + extension) > -1) {
                            // overwrite req.url
                            req.url = req.url + extension
                            req.originalUrl = req.originalUrl + extension
                            doProxy = false
                        }
                    }
                }
            }
        }

        // filter by context
        if (doProxy) {
            doProxy = false
            let originalPath = (req.originalUrl || req.url)
            doProxy = contextMatcher.match(config.context, originalPath, req)
        }

        // emit
        if (proxyEventEmitter) {
            proxyEventEmitter.emit('proxyEvent', JSON.stringify({
                originalUrl: req.originalUrl,
                proxy: doProxy
            }))
        }

        return doProxy
    }
}

/**
 * 文件遍历
 * @param {String} filePath 需要遍历的文件路径
 * @param {Boolean} recursive 是否向下递归
 */
function fetchFiles(filePath, recursive) {
    let fileNames = []
    try {
        //根据文件路径读取文件，返回文件列表
        let files = fs.readdirSync(filePath)
        //遍历读取到的文件列表
        files.forEach((filename) => {
            //获取当前文件的绝对路径
            var filedir = path.join(filePath, filename)
            try {
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                let stats = fs.statSync(filedir)

                var isFile = stats.isFile(); //是文件
                var isDir = stats.isDirectory(); //是文件夹
                if (isFile) {
                    fileNames.push(filedir)
                }
                if (isDir && recursive) {
                    fileNames.push(fetchFiles(filedir)); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                }
            } catch (error) {}
        })
    } catch (error) {}

    return fileNames
}

opts.onProxyReq = onProxyReq

function getOpts(port, proxyEventEmitter) {
    opts.onProxyRes = getProxyResHandler(port, proxyEventEmitter)

    // custom router
    opts.router = function customRoute(req) {
        // get target from route table
        let target = Router.getTarget(req, config.options)
        // process regExpRoutes, try build new target if matched
        if (!target) {
            let reqUrl = (req.originalUrl || req.url)
            let reqPathname = new URL('http://' + req.headers.host + reqUrl).pathname
            if (regExpRoutes.length) {
                for (let i = 0; i < regExpRoutes.length; i++) {
                    const route = regExpRoutes[i];
                    if (route.regExp instanceof Array) {
                        let matched = false
                        for (let j = 0; j < route.length; j++) {
                            const soloRegExp = route[j];
                            if (soloRegExp.constructor.name === 'RegExp' && soloRegExp.test(reqPathname)) {
                                target = route.target + reqUrl
                                matched = true
                                break
                            }
                        }
                        if (matched) {
                            break
                        }
                    } else if (route.regExp.constructor.name === 'RegExp' && route.regExp.test(reqPathname)) {
                        target = route.target + reqUrl
                        break
                    }
                }
            }

            // XMLHttpRequest rule process
            if (!target && req.headers['X-Requested-With'] === 'XMLHttpRequest' && xmlHttRequestTarget) {
                target = xmlHttRequestTarget + reqUrl
            }
        }

        // emit
        if (proxyEventEmitter) {
            proxyEventEmitter.emit('proxyEvent', JSON.stringify({
                originalUrl: req.originalUrl,
                target: target
            }))
        }

        return target
    }

    return opts
}

function createProxyCfg(port, eventEmitter) {
    return {
        filter: getFilter(eventEmitter),
        opts: getOpts(port, eventEmitter)
    }
}

exports = module.exports = function newProxy(port) {
    let eventEmitter = require('./eventEmitter')
    let proxyCfg = createProxyCfg(port, eventEmitter)

    return proxy(proxyCfg.filter, proxyCfg.opts)
}