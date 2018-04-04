module.exports = function(router) {
    router.get('/index', function(req, res) {
        res.json({data: 'Hello World!'})
    })

    return router
}