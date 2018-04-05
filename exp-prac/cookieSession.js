const session = require('./middlewares/session')
const RedisStore = require('./middlewares/connect-redis')(session);
const config = require('./config')
var debug = require('debug')('session');

const redisStoreOpts = {
    host: '192.168.0.105',
    port: 6379,
    prefix: `sess:${config.sessionIdentify}_`,
    serializer: {
        serialize: function (obj) {
            let result = {}
            if (obj && typeof obj === 'object' && !(obj instanceof Array)) {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const val = obj[key];
                        if (val) {
                            if(typeof val !== 'string') {
                                try {
                                    result[key.toString()] = JSON.stringify(val)
                                } catch (er) {
                                    debug('session serialize occur err', er);
                                }
                            } else {
                                result[key.toString()] = val
                            }
                        }
                    }
                }
            }
            return result
        },
        deserialize: function (obj) {
            if (obj && typeof obj === 'object' && !(obj instanceof Array)) {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const val = obj[key];
                        if (val && typeof val === 'string') {
                            try {
                                obj[key] = JSON.parse(val)
                            } catch (er) {
                                debug('session deserialize occur err', er);
                            }
                        }
                    }
                }
            }
            return obj
        }
    }
}

const sessionOpts = {
    resave: false,
    name: 'ASP.NET_SessionId',
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000
    }
}

module.exports.sessionOpts = sessionOpts

module.exports.session = session({
    store: new RedisStore(redisStoreOpts),
    ...sessionOpts,
})