const xml2js = require('xml2js')
const Promise = require('bluebird')
Promise.promisifyAll(xml2js)

const parseBody = require('../common/parseBody')
const parserOpts = require('../common/bodyParserOpts')

async function receive (ctx, next) {
    let contentType = ctx.request.header['content-type']
    if (contentType && (contentType === 'text/xml' || contentType === 'application/xml')) {
        await parseBody(ctx, parserOpts.common)
        let message = (await xml2js.parseStringAsync(ctx.request.body)).xml
        message.FromUserName

        ctx.response.body = `<xml><ToUserName><![CDATA[${message.FromUserName}]]></ToUserName><FromUserName><![CDATA[${message.ToUserName}]]></FromUserName><CreateTime>${new Date().getTime()}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好]]></Content></xml>`
        ctx.response.type = contentType
    }
}

exports = module.exports = receive
