'use strict'

const parserOpts = require('./bodyParserOpts')

const bodyParser = require('koa-bodyparser')
const logger = require('./logger')

exports = module.exports = bodyParser(parserOpts.common)