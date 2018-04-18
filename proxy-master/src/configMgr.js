'use strict'

const fs = require('fs')
const path = require('path')
const proxyContainer = require('../lib/index')
const defaultConfig = require('./defaultConfig')
const configFactory = require('../lib/config-factory')
const beautify = require('js-beautify/js')
const Ajv = require('ajv')
const userConfigSchema = require('./userConfigSchema')
const { deepClone } = require('../utils')

const ajv = new Ajv()
const validateUserConfig = ajv.compile(userConfigSchema)

const defConfig = {
    "context": ["/"],
    "changeOrigin": false,
    "fiddleAspRoute": false,
    "router": {},
    "pathRewrite": {},
    "regExpRoutes": [],
    "xmlHttRequestTarget": ""
  }

class ConfigMgr {
    constructor(args) {
        this.loadConfig = this.loadConfig.bind(this)
        this.dumpToFile = this.dumpToFile.bind(this)
        this.updateUserConfig = this.updateUserConfig.bind(this)
        this.preProcess = this.preProcess.bind(this)
        this.fetchUserConfig = this.fetchUserConfig.bind(this)

        this.userConfig = null
        this.userConfigFileName = path.resolve(__dirname, './userConfig.json')
    }

    loadConfig() {
        // load dump file
        if (!this.userConfig && fs.existsSync(this.userConfigFileName)) {
            let stat = fs.statSync(this.userConfigFileName)
            if (stat && stat.isFile()) {
                let content = fs.readFileSync(this.userConfigFileName, 'utf8')
                this.userConfig = JSON.parse(content)
            }
        }

        // merge static config and dump file
        let mergedConfig = Object.assign({}, defConfig, defaultConfig, this.userConfig)

        mergedConfig = this.preProcess(mergedConfig)

        return mergedConfig
    }

    fetchUserConfig () {
        return this.userConfig
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

            let proxyCfg = this.preProcess(newConfig)
            proxyContainer.opts = Object.assign({}, defaultConfig, proxyCfg)

            let config = configFactory.createConfig(proxyCfg.context, proxyCfg)

            proxyContainer.context = config.context
            proxyContainer.proxyOptions = config.options

            proxyContainer.updateOptions()

            // todo: update dump file
            this.dumpToFile()

            return { code: 0, data: this.userConfig}
        }
    }

    preProcess(config) {
        let dummyConfig = deepClone(config)
        if (dummyConfig.mockServer && dummyConfig.mockPaths && dummyConfig.mockPaths.length > 0) {
            for (let i = 0; i < dummyConfig.mockPaths.length; i++) {
                const mockPath = config.mockPaths[i]
                if (mockPath.mock) {
                    dummyConfig.router[mockPath.path] = config.mockServer
                    dummyConfig.pathRewrite['^' + mockPath.path] = `/mocking/${config.mockPrefix + mockPath.path}`
                }
            }
        }
        return dummyConfig
    }
}

exports = module.exports = new ConfigMgr()