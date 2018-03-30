'use strict'

const fs = require('fs')
const proxyContainer = require('../lib/index')
const staticConfig = require('../defaultConfig')

class ConfigMgr {
    constructor(args) {
        this.loadConfig = this.loadConfig.bind(this)
        this.dumpToFile = this.dumpToFile.bind(this)
        this.changeContext = this.changeContext.bind(this)
        this.changeTarget = this.changeTarget.bind(this)

        this.dumpFile = './dump.data'
        this.dummyConfig = {}
    }

    loadConfig() {
        // todo: load dump file
        let dumpConfig = null
        if (fs.existsSync(this.dumpFile)) {
            let dumpConfig = {}
            let stat = fs.statSync(this.dumpFile)
            if (stat && stat.isFile()) {
                let content = fs.readFileSync(this.dumpFile, 'utf8')
                dumpConfig = JSON.parse(content)
            }
        }

        // todo: merge static config and dump file

        let mergedConfig = this.dummyConfig = Object.assign({}, dumpConfig, staticConfig)

        if (!dumpConfig) {
            this.dumpToFile()
        }

        return mergedConfig
    }

    dumpToFile() {
        // todo: dump config to file, overwrite
        fs.writeFileSync(this.dumpFile, JSON.stringify(this.dummyConfig))
    }

    changeContext(newContext) {
        proxyContainer.context = this.dummyConfig.context = newContext

        // todo: update dump file
    }

    changeTarget(newTarget) {
        proxyContainer.target = newTarget

        // todo: update dump file
    }
}

exports = module.exports = new ConfigMgr()