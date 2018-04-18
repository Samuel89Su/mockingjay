var express = require('express')

const {
    fetchUserConfig,
    updateUserConfig,
    loadConfig
} = require('./configMgr')

function initRouter(prefixPath, router) {
    router.use(prefixPath, express.json())
    router.use(prefixPath, express.urlencoded({
        extended: false
    }))

    router.get(prefixPath + '/fetchUserConfig', function (req, res) {
        let config = fetchUserConfig()
        let data = {
            code: 0,
            data: config
        }
        res.setHeader('Content-Type', 'application/json')
        res.send(data)
        return
    })

    router.post(prefixPath + '/updateUserConfig', function (req, res, next) {
        let result = updateUserConfig(req.body)
        res.setHeader('Content-Type', 'application/json')
        res.send(result)
    })

    router.get(prefixPath + '/inspectConfig', (req, res, next) => {
        let result = loadConfig()
        res.setHeader('Content-Type', 'application/json')
        res.send(result)
    })
}

module.exports = initRouter