module.exports = function(router) {
    router.post('/login', function(req, res) {
        req.session.userName = 'joe'
        req.session.userId = 321
        res.json({name: 'ss'})
    })

    return router;
}