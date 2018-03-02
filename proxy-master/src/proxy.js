'use strict'

const proxy = require('http-proxy-middleware')
const { URL } = require('url')
const queryString = require('query-string')
const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const cfg = require('../cfg')

const opts = cfg.proxyOpts

const targetHost = new URL(opts.target).host

function onProxyReq(proxyReq, req, res) {
}

function getProxyResHandler(port, proxyEventEmitter) {
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
                    query.fromurl = query.fromurl.replace(redirectUrl.host, 'localhost:' + port)
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

function getFilter(root, proxyEventEmitter) {
    /**
     * @param {String} pathname
     * @param {Object} req
     * @return {Boolean}
     */
    return function filter(pathname, req) {
        let doProxy = true
        if (req.method === 'GET' || req.method === 'HEAD') {
            if (pathname.lastIndexOf('.') > pathname.lastIndexOf('/')) {
                let filePath = path.join(root, pathname)
                try {
                    let stats = fs.statSync(filePath)
                    if (stats.isFile()) {
                        doProxy = false
                    }
                } catch (error) {
                }
            } else if (cfg.fiddleAspRoute) {
                let parentDir = pathname.substr(0, pathname.lastIndexOf('/'))
                var files = fetchFiles(root + parentDir)
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
            } catch (error) {
            }
        })
    } catch (error) {
    }

    return fileNames
}

opts.onProxyReq = onProxyReq

function getOpts(port, eventEmitter) {
    opts.onProxyRes = getProxyResHandler(port, eventEmitter)
    return opts
}

function createProxyCfg(root, port, eventEmitter) {
    return {
        filter: getFilter(root, eventEmitter),
        opts: getOpts(port, eventEmitter)
    }
}

exports = module.exports = function newProxy(eventEmitter) {
    let proxyCfg = createProxyCfg(cfg.staticRoot, cfg.port, eventEmitter)

    return proxy(proxyCfg.filter, proxyCfg.opts)
}