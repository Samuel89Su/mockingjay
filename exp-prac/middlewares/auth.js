const { sessionOpts } = require('../cookieSession')

module.exports = function(req, res, next) {
    // auth validation
    if (!req.path.includes('login')) {
        if (req.session.userId < 1) {
            res.status(403)
            res.end()
            res.clearCookie(sessionOpts.name)
            return
        }
    }

    next()
    return
}