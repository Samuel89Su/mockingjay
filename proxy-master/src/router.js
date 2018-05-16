'use strict'

const express = require('express')
const path = require('path')
const url = require('url')

const config = require('./config')

const {
  loadConfig,
  updateUserConfig
} = require('./configMgr')

const controlRouter = express.Router()

controlRouter.use('', express.json())
controlRouter.use(express.urlencoded({
  extended: false
}))

controlRouter.post('/fetchUserConfig', function (req, res) {
  let config = loadConfig()
  let data = {
    code: 0,
    data: config
  }
  res.setHeader('Content-Type', 'application/json')
  res.send(data)
})

controlRouter.post('/updateUserConfig', function (req, res) {
  let result = updateUserConfig(req.body)
  res.setHeader('Content-Type', 'application/json')
  res.send(result)
})

module.exports.controlRouter = controlRouter

const consoleRouter = express.Router()

const options = {
  root: config.static,
  headers: {
    'x-timestamp': Date.now(),
    'content-type': 'text/html; charset=utf-8'
  }
}

consoleRouter.get('/', (req, res) => {
  res.setHeader('location', '/console/index.html')
  res.status(302)
  res.send('redirect')
})

consoleRouter.get('/index', (req, res) => {
  res.sendfile('index.html', options, (err) => {
    if (err) {
      next(err)
    } else {
      res.end()
    }
  })
})

module.exports.consoleRouter = consoleRouter