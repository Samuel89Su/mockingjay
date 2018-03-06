const config = require('./config')

const defaultConfig = {
    host: '0.0.0.0',
    port: 3000
}

const mergedConfig = Object.assign({}, config, defaultConfig)

exports = module.exports = mergedConfig
