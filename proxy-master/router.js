const express = require('express')
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.all('/', function(req, res, next) {
  res.send('respond with a resource')
})

module.exports = router
