const _ = require('lodash')
const { URL } = require('url')
const logger = require('./logger.js').getInstance()

module.exports = {
  getTarget: getTarget
}

function getTarget(req, config) {
  var newTarget
  var router = config.router

  if (_.isPlainObject(router)) {
    newTarget = getTargetFromProxyTable(req, router)
  } else if (_.isFunction(router)) {
    newTarget = router(req)
  }

  if (!newTarget) {
    newTarget = GetTargetAccordingToExtensions(req, config)
  }

  return newTarget
}

function getTargetFromProxyTable(req, table) {
  var result
  var host = req.headers.host
  var path = req.url

  var hostAndPath = host + path

  _.forIn(table, function (value, key) {
    if (containsPath(key)) {
      if (hostAndPath.indexOf(key) > -1) { // match 'localhost:3000/api'
        result = table[key]
        logger.debug('[HPM] Router table match: "%s"', key)
        return false
      }
    } else {
      if (key === host) { // match 'localhost:3000'
        result = table[key]
        logger.debug('[HPM] Router table match: "%s"', host)
        return false
      }
    }
  })

  return result
}

function GetTargetAccordingToExtensions(req, config) {
  let target
  let reqUrl = (req.originalUrl || req.url)
  let reqPathname = new URL(req.protocol + '://' + req.headers.host + reqUrl).pathname
  if (config.regExpRoutes.length) {
    for (let i = 0; i < config.regExpRoutes.length; i++) {
      const route = config.regExpRoutes[i];
      if (route.regExp instanceof Array) {
        let matched = false
        for (let j = 0; j < route.length; j++) {
          const soloRegExp = new RegExp(route[j])
          if (soloRegExp.constructor.name === 'RegExp' && soloRegExp.test(reqPathname)) {
            target = route.target
            matched = true
            break
          }
        }
        if (matched) {
          break
        }
      } else {
        let regExp = new RegExp(route.regExp)
        if (regExp.constructor.name === 'RegExp' && regExp.test(reqPathname)) {
          target = route.target
          break
        }
      }
    }
  }

  // XMLHttpRequest rule process
  if (!target && req.headers['x-requested-with'] === 'XMLHttpRequest' && config.xmlHttRequestTarget) {
    target = config.xmlHttRequestTarget
  }

  return target
}

function containsPath(v) {
  return v.indexOf('/') > -1
}