const fs = require('fs')

const defaultConfig = {
    host: '0.0.0.0',
    port: 3000
}

let config = {}
try {
    let stat = fs.statSync('./config.js')
    if (stat && stat.isFile()) {
        config = require('./config')
    }
} catch (error) {
    
}

const mergedConfig = Object.assign({}, defaultConfig, config)

exports = module.exports = mergedConfig
