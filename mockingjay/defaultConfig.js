const fs = require('fs')

const defaultConfig = {
    host: '0.0.0.0',
    port: 3000
}

let config = {}
if (fs.statSync('./config.js').isFile()) {
    config = require('./config')
}

const mergedConfig = Object.assign({}, defaultConfig, config)

exports = module.exports = mergedConfig
