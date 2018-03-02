'use strict'

const {
    URL
} = require('url')
const queryString = require('query-string')
const fs = require('fs')
const path = require('path')

const defaultOpts = {
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    // logLevel: 'info',
    // logProvider: logProvider,
}

const userOpts = require('./opts')

const opts = Object.assign({}, userOpts, defaultOpts)

const targetHost = new URL(opts.target).host

function onProxyReq(proxyReq, req, res) {
    // add custom header to request 
    // or log the req 
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
                    // console.log('origin redirect url: ' + location)

                    query.fromurl = query.fromurl.replace(redirectUrl.host, 'localhost:' + port)
                    proxyRes.headers.location = proxyRes.headers.location.replace(search, '?' + queryString.stringify(query))
                }
            }
            // console.log('modified redirect to: ' + proxyRes.headers.location)
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
            let parentDir = pathname.substr(0, pathname.lastIndexOf('/'))
            var files = fetchFiles(root + parentDir)
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const fileName = files[i]
                    let fileNameWithoutExtension = fileName.substr(6).replace(/\\/g, '/')
                    if (pathname.lastIndexOf('.') === -1) {
                        fileNameWithoutExtension = fileNameWithoutExtension.substr(0, fileNameWithoutExtension.lastIndexOf('.'))
                    }
                    if (pathname === fileNameWithoutExtension) {
                        doProxy = false
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
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
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
                // console.warn(error)
            }
        })
    } catch (error) {
        // console.warn(error)
    }

    return fileNames
}

opts.onProxyReq = onProxyReq

function getOpts(port, eventEmitter) {
    opts.onProxyRes = getProxyResHandler(port, eventEmitter)
    return opts
}

exports = module.exports = function createOpt(root, port, eventEmitter) {
  return {
    filter: getFilter(root, eventEmitter),
    opts: getOpts(port, eventEmitter)
  }
}
