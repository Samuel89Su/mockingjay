const express = require('express')
const { changeTarget } = require('./defaultConfig')

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.all('/', function(req, res, next) {
  changeTarget(req.body.target)
  res.send('respond with a resource')
})

module.exports = router
