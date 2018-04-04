const session = require('express-session')
const RedisStore = require('connect-redis')(session);
const config = require('./config')

const redisStoreOpts = {
    host: '127.0.0.1',
    port: 6379
}

const sessionOpts = {
    secret: 'exp-prac',
    resave: false,
    name: 'sid',
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 }
}

module.exports = session({
    store: new RedisStore(redisStoreOpts),
    ...sessionOpts,
})