'use strict'

const path = require('path')

const config = {
    port: 8300,
    host: '0.0.0.0',
    ip: '172.16.211.106',
    domain: '',
    target: 'http://teacher.233.mistong.com',
    static: path.resolve(__dirname, 'static')
}

exports = module.exports = config