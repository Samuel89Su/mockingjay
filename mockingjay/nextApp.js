const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })

exports = module.exports = nextApp