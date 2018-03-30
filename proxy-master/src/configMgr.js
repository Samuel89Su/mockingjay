'use strict'

const proxyContainer = require('../lib/index')
const staticConfig = require('../defaultConfig')

class ConfigMgr {
    constructor(args) {
        this.loadConfig = this.loadConfig.bind(this)
        this.dumpToFile = this.dumpToFile.bind(this)
        this.changeContext = this.changeContext.bind(this)
        this.changeTarget = this.changeTarget.bind(this)

        this.dummyConfig = null
    }

    loadConfig() {
        // todo: load dump file

        // todo: merge static config and dump file

        let mergedConfig = this.dummyConfig = Object.assign({}, staticConfig)
        return mergedConfig
    }

    dumpToFile() {
        // todo: dump config to file, overwrite
    }

    changeContext(newContext) {
        proxyContainer.context = newContext

        // todo: update dump file
    }

    changeTarget(newTarget) {
        proxyContainer.target = newTarget

        // todo: update dump file
    }
}

exports = module.exports = new ConfigMgr()