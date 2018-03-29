const express = require('express')
const { changeContext } = require('./lib/index')

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.all('/', function(req, res, next) {
  changeContext(req.body.context)
  res.send('respond with a resource')
})

module.exports = router
