'use strict'

const fs = require('fs')
const proxyContainer = require('../lib/index')
const staticConfig = require('../defaultConfig')

class ConfigMgr {
    constructor(args) {
        this.loadConfig = this.loadConfig.bind(this)
        this.dumpToFile = this.dumpToFile.bind(this)
        this.updateUserConfig = this.updateUserConfig.bind(this)

        this.userConfig = null
        this.userConfigFileName = './userConfig.json'
    }

    loadConfig() {
        // todo: load dump file
        if (!this.userConfig && fs.existsSync(this.userConfigFileName)) {
            let stat = fs.statSync(this.userConfigFileName)
            if (stat && stat.isFile()) {
                let content = fs.readFileSync(this.userConfigFileName, 'utf8')
                this.userConfig = JSON.parse(content)
            }
        }

        // todo: merge static config and dump file

        let mergedConfig = Object.assign({}, staticConfig, this.userConfig)

        return mergedConfig
    }

    dumpToFile() {
        // todo: dump config to file, overwrite
        fs.writeFileSync(this.userConfigFileName, JSON.stringify(this.userConfig))
    }

    updateUserConfig(newConfig) {
        if (newConfig) {
            if (this.userConfig.context !== newConfig.context) {
                this.userConfig.context = newConfig.context

                proxyContainer.context = newConfig.context
            }
            if (this.userConfig.target !== newConfig.target) {
                this.userConfig.target = newConfig.target

                proxyContainer.context = newConfig.context
            }
            if (this.userConfig.xmlHttRequestTarget !== newConfig.xmlHttRequestTarget) {
                this.userConfig.xmlHttRequestTarget = newConfig.xmlHttRequestTarget
            }

            this.userConfig.router = newConfig.router

            this.userConfig.regExpRoutes = newConfig.regExpRoutes
        }

        proxyContainer.context = this.userConfig.context = newContext

        // todo: update dump file
        this.dumpToFile()
    }
}

exports = module.exports = new ConfigMgr()