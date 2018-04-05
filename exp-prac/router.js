const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const auth = require('./middlewares/auth')

const { session } = require('./cookieSession')

router.use('/api', session, auth, bodyParser.json())

router.use('/api', require('./controllers/index')(router))
router.use('/api/user', require('./controllers/user')(router))

exports = module.exports = router