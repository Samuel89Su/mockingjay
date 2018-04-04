module.exports = function(router) {
    router.post('/login', function(req, res) {
        req.session.user = { uid: 1 }
        res.json({name: 'ss'})
    })

    return router;
}