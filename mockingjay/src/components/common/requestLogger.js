'use strict';

const fs = require('fs');
const path = require('path');
const Bunyan = require('bunyan');
const LoggerFactory = require('./loggerFactory');

// const requestLogger = new LoggerFactory({ env: 'dev', folder: path.join(__dirname, '../../requestLogs') }).createLogger('mockingjay');

const basePath = path.join(__dirname, '../../../requestLogs');

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
}

const requestLogger = Bunyan.createLogger(
    {
        name: 'requestLogger',
        level: 'info',
        streams: [{
            level: 'info',
            type: 'rotating-file',
            path: path.join(basePath, '/request.log'),
            count: 30
        }]
    });

exports = module.exports = requestLogger;