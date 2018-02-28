const proxyEventEmitter = require('./eventEmitter')

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 40510
    })

wss.on('connection', function (ws) {
    proxyEventEmitter.on('proxyEvent', (payload) => {
        ws.send(payload)
    })

    ws.on('message', function (message) {
        console.log('received: %s', message)
    })
})