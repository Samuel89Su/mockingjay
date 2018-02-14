'use strict';

const fs = require('fs');
const path = require('path');
const Bunyan = require('bunyan');

const LoggerMap = new Map()

class RequestLoggerFactory {
    constructor (props) {        
        this.baseFolder = !(props && props.baseFolder) ? path.join(__dirname, '../../../requestLogs') : props.baseFolder

        this.getLogger = this.getLogger.bind(this)
        this.prepareLogFolder = this.prepareLogFolder.bind(this)

        this.prepareLogFolder()

        // set default logger
        LoggerMap.set('default',
            Bunyan.createLogger(
                {
                    name: 'default_logger',
                    level: 'info',
                    streams: [{
                        level: 'info',
                        type: 'rotating-file',
                        path: path.join(this.baseFolder, '/request.log'),
                        count: 30
                    }]
                }))
    }

    getLogger (appName) {
        // return default logger
        if (!appName) {
            return LoggerMap.get('default')
        }

        let logger = LoggerMap.get(appName)
        if (!logger) {
            this.prepareLogFolder(appName)
            logger = Bunyan.createLogger(
                {
                    name: `${appName}_logger`,
                    level: 'info',
                    streams: [{
                        level: 'info',
                        type: 'rotating-file',
                        path: path.join(this.baseFolder, appName, '/request.log'),
                        count: 30
                    }]
                })

            LoggerMap.set(appName, logger)
        }

        return logger
    }

    prepareLogFolder (appName) {
        let folder = path.join(this.baseFolder, !appName ? '' : appName)
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }
    }
    
}

exports = module.exports = new RequestLoggerFactory()