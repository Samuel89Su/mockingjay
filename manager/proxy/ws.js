const proxyEventEmitter = require('./eventEmitter')

exports = module.exports = function(port) {

    const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: port + 1
    })

    wss.on('connection', function (ws) {
        proxyEventEmitter.on('proxyEvent', (payload) => {
            ws.send(payload)
        })

        // ws.on('message', function (message) {
        //     console.log('received: %s', message)
        // })
    })
}