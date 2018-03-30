const express = require('express')
const {
  changeContext,
  loadConfig
} = require('./src/configMgr')

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({
  extended: false
}))

router.get('/fetchConfig', function (req, res) {
  let config = loadConfig()
  let data = {code:0, data:config}
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(data))
})

router.post('/updateContext', function (req, res, next) {
  changeContext(req.body.context)
  res.send('respond with a resource')
})

module.exports = router