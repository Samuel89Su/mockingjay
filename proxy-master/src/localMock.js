'use strict'

module.exports = localMock

const express = require('express')
const path = require('path')
const url = require('url')

const { loadConfig } = require('./configMgr')

const options = {
    root: path.resolve(__dirname, '../mocking/'),
    headers: {
        'x-timestamp': Date.now(),
        'content-type': 'application/json'
    }
}

// 拦截所有请求
function localMock (req, res, next) {
    let config = loadConfig()
    if (config && config.mockServer && config.mockServer === 'localhost') {
        var reqPath = (req.originalUrl || req.url)
        let pathname = reqPath && url.parse(reqPath).pathname
        // has no extension
        if (reqPath.lastIndexOf('.') < reqPath.lastIndexOf('/')) {
            // in mockPaths
            for (let i = 0; i < config.mockPaths.length; i++) {
                const mockPath = config.mockPaths[i];
                if (mockPath.path !== reqPath) {
                    continue
                }
                // retrieve & send file
                if (mockPath.mock) {
                    let fileName = pathname + '.json'
                    res.sendfile(fileName, options, (err) => {
                        if (err) {
                            next(err)
                        } else {
                            console.log('Sent:', fileName)
                            res.end()
                        }
                    })
                }
            }
        }
    }
}