'use strict'

const fs = require('fs')
const proxyContainer = require('../lib/index')
const defaultConfig = require('../defaultConfig')
const configFactory = require('../lib/config-factory')
const beautify = require('js-beautify/js')
const Ajv = require('ajv')
const userConfigSchema = require('./userConfigSchema')

const ajv = new Ajv()
const validateUserConfig = ajv.compile(userConfigSchema)

const defConfig = {
    "context": ["/"],
    "changeOrigin": false,
    "fiddleAspRoute": false,
    "router": {
    },
    "regExpRoutes": [],
    "xmlHttRequestTarget": ""
  }

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

        let mergedConfig = Object.assign({}, defConfig, defaultConfig, this.userConfig)

        return mergedConfig
    }

    dumpToFile() {
        let rawString = JSON.stringify(this.userConfig)
        let prettyString = beautify(rawString, { indent_size: 2, space_in_empty_paren: true })
        // todo: dump config to file, overwrite
        fs.writeFile(this.userConfigFileName, prettyString, (err)=>{

        })
    }

    updateUserConfig(newConfig) {
        if (newConfig) {

            if (!validateUserConfig(newConfig)) {
                return { code: 400001, data: validateUserConfig.errors, msg: 'json 格式错误' }
            }

            this.userConfig = newConfig
            proxyContainer.opts = Object.assign({}, defaultConfig, this.userConfig)

            let config = configFactory.createConfig(newConfig.context, newConfig)

            proxyContainer.context = config.context
            proxyContainer.proxyOptions = config.options

            // todo: update dump file
            this.dumpToFile()

            return { code: 0, data: newConfig}
        }
    }
}

exports = module.exports = new ConfigMgr()