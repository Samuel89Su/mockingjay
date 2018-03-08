const crypto = require('crypto')

const token = '201cee02afe34b39a9dd48dc2b53fd05'

async function verifyWeChatSign(ctx, next) {
    let sign = ctx.request.query['signature']
    let timestamp = ctx.request.query['timestamp']
    let nonce = ctx.request.query['nonce']

    let arr = [token, timestamp, nonce]
    arr = arr.sort()
    let joinedStr = arr.join('')
    var sha1 = crypto.createHash('sha1')
    sha1.update(joinedStr)
    let calSign = sha1.digest('hex')

    if (calSign === sign) {
        ctx.response.body = ctx.request.query['echostr']
        ctx.response.status = 200
    } else {
        ctx.response.status = 401
    }
    return
}

exports = module.exports = verifyWeChatSign
