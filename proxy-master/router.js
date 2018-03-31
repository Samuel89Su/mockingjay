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

router.get('/fetchUserConfig', function (req, res) {
  let config = loadConfig()
  let data = {code:0, data:config}
  res.setHeader('Content-Type', 'application/json')
  res.send(data)
})

router.post('/updateUserConfig', function (req, res, next) {
  let result = updateUserConfig(req.body)
  res.setHeader('Content-Type', 'application/json')
  res.send(result)
})

module.exports = router