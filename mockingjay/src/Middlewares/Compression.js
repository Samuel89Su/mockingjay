'use strict'

/**
 * Module dependencies.
 * @private
 */

const bytes = require('bytes')
const compressible = require('compressible')
const Stream = require('stream')
const zlib = require('zlib')

/**
 * Module exports.
 */

module.exports = compression
module.exports.filter = shouldCompress

/**
 * Module variables.
 * @private
 */

const encodingMethods = {
    gzip: zlib.createGzip,
    deflate: zlib.createDeflate
}

const bufferedMethods = {
    gzip: zlib.gzipSync,
    deflate: zlib.deflateSync
}

/**
 * Compress response data with gzip / deflate.
 *
 * @param {Object} [options]
 * @return {Function} middleware
 * @public
 */

function compression(options) {
    let opts = options || {}

    // options
    var filter = opts.filter || shouldCompress
    var threshold = bytes.parse(opts.threshold)

    if (threshold == null) {
        threshold = 2048
    }

    return async function compress(ctx, next) {
        ctx.vary('Accept-Encoding')

        await next()

        let {
            body,
            response,
            request
        } = ctx
        if (!body) return
        if (ctx.length < threshold) return

        const encoding = response.get('Content-Encoding') || 'identity'
        if (encoding !== 'identity') return
        if (!filter(ctx)) return

        if (request.method === 'HEAD') return

        const acceptEncoding = ctx.acceptsEncodings('gzip', 'deflate', 'identity')
        if (!acceptEncoding) ctx.throw(406, 'supported encodings: gzip, deflate, identity')
        if (acceptEncoding === 'identity') return

        // header fields
        ctx.set('Content-Encoding', acceptEncoding)
        response.remove('Content-Length')

        const encodingMethod = encodingMethods[acceptEncoding]
        const stream = ctx.body = encodingMethod(opts)
        if (body instanceof Stream) {
            body.pipe(stream)
        } else {
            if (typeof body !== 'string' && (body instanceof Array || (/application\/json/i.test(ctx.type) && typeof body === 'object'))) {
                body = JSON.stringify(body)
            }
            if (typeof body === 'string') {
                stream.end(body)
            }
        }
    }

}

/**
 * Default filter function.
 * @private
 */

function shouldCompress(ctx) {
    var type = ctx.response.get('Content-Type')

    if (type === undefined || !compressible(type)) {
        return false
    }

    return true
}