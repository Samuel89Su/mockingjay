'use strict';

const path = require('path');
const LoggerFactory = require('./loggerFactory');

const logger = new LoggerFactory({ env: 'dev', folder: path.join(__dirname, '../../logs') })
    .createLogger('mockingjay');

exports = module.exports = logger;