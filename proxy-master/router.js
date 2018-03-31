const express = require('express')
const {
  loadConfig,
  updateUserConfig
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

router.post('/updateUserConfig', function (req, res, next) {
  updateUserConfig(req.body)
  res.setHeader('Content-Type', 'application/json')
  res.send({code: 0})
})

module.exports = router