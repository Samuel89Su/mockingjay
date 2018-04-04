module.exports = function(req, res, next) {
    // auth validation
    if (!req.path.includes('login')) {
        if (!req.session.user || req.session.user.uid < 1) {
            res.status(403)
            res.end()
            return
        }
    }

    next()
    return
}