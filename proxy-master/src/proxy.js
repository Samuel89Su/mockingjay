'use strict'

const proxy = require('http-proxy-middleware')
const {
    URL
} = require('url')
const queryString = require('query-string')
const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const cfg = require('../cfg')
const configFactory = require('http-proxy-middleware/lib/config-factory')
const contextMatcher = require('http-proxy-middleware/lib/context-matcher')
const Router = require('./router')

const opts = cfg.proxyOpts
const context = cfg.proxyOpts.context
delete cfg.proxyOpts.context

// extract regexp routes
const regExpRoutes = {}
if (opts.router) {
    for (const key in opts.router) {
        if (opts.router.hasOwnProperty(key)) {
            const routeTarget = opts.router[key];
            if ((key).constructor.name === 'RegExp') {
                regExpRoutes[key] = routeTarget
                delete opts.router[key]
            }
        }
    }
}
const config = configFactory.createConfig(context, cfg.proxyOpts)

const targetHost = new URL(opts.target).host

function onProxyReq(proxyReq, req, res) {}

function getProxyResHandler(proxyEventEmitter) {
    return function onProxyRes(proxyRes, req, res) {
        if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
            let location = proxyRes.headers.location
            let search = location.substr(location.indexOf('?'))
            let query = queryString.parse(search)
            if (query.fromurl) {
                let redirectUrl = new URL(query.fromurl)
                let segs = targetHost.split('.').reverse()
                let domain = segs.pop() + '.' + segs.pop()
                if (redirectUrl.host.indexOf(domain) > -1) {
                    query.fromurl = query.fromurl.replace(redirectUrl.host, 'localhost:' + cfg.port)
                    proxyRes.headers.location = proxyRes.headers.location.replace(search, '?' + queryString.stringify(query))
                }
            }
        }

        if (proxyEventEmitter) {
            proxyEventEmitter.emit('proxyEvent', JSON.stringify({
                reqUrl: req.url,
                statusCode: proxyRes.statusCode
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
        let doProxy = false
        // send local file
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

        let originalPath = (req.originalUrl || req.url)
        doProxy = contextMatcher.match(config.context, originalPath, req)

        // emit
        if (proxyEventEmitter) {
            proxyEventEmitter.emit('proxyEvent', JSON.stringify({
                pathName: pathname,
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

function getOpts(eventEmitter) {
    opts.onProxyRes = getProxyResHandler(cfg.port, eventEmitter)

    // custom router
    opts.router = function customRoute(req) {
        let target = Router.getTarget(req, config.options)
        // process regExpRoutes
        if (!target) {
            let host = req.headers.host
            let path = req.url
            let hostAndPath = host + path
            for (const key in regExpRoutes) {
                if (regExpRoutes.hasOwnProperty(key)) {
                    const replaceStr = regExpRoutes[key];
                    if (key.test(hostAndPath)) {
                        target = hostAndPath.replace(key, replaceStr)
                        break
                    }
                }
            }
        }
    }

    return opts
}

function createProxyCfg(eventEmitter) {
    return {
        filter: getFilter(eventEmitter),
        opts: getOpts(eventEmitter)
    }
}

exports = module.exports = function newProxy(eventEmitter) {
    let proxyCfg = createProxyCfg(eventEmitter)

    return proxy(proxyCfg.filter, proxyCfg.opts)
}