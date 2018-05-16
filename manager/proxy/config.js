'use strict'

const path = require('path')

const config = {
    port: 8100,
    host: '0.0.0.0',
    lanIP: '',
    domain: '',
    target: 'http://teacher.233.mistong.com',
    static: path.resolve(__dirname, '../static'),
    mockFolder: path.resolve(__dirname, '../mocking')
}

exports = module.exports = config