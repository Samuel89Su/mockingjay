const parseBody = require('../common/parseBody');
const parserOpts = require('../common/bodyParserOpts');
const requestInspector = require('./requestInspector');
const responseBaker = require('./responseBaker');
const logger = require('../common/logger');
const requestLogger = require('../common/requestLogger');

async function mocking(ctx, apiDescriptor) {
    try {

        // parse body
        await parseBody(ctx, parserOpts.common);

        // inspect request
        let bypassReqInspect = false;
        let isReqValid = false;
        if (apiDescriptor.mockCfg.validateReq) {
            var inspecRes = await requestInspector.inspect(ctx.request, apiDescriptor.mockCfg.reqDescriptor);
            if (inspecRes.code !== 200) {
                ctx.status = inspecRes.code;
                ctx.body = inspecRes.msg;
                ctx.response.type = 'text/plain';
            } else {
                isReqValid = true;
            }
        } else {
            bypassReqInspect = true;
        }

        // generate response
        if (bypassReqInspect || isReqValid) {
            // generate response
            await responseBaker.bake(ctx, apiDescriptor.mockCfg.resDescriptor);
        }

        // logging
        await logRequest(ctx.request, ctx.response);
    } catch (error) {
        logger.error(error);
        await set500(ctx, error);
    } finally {

    }
}

function set500(ctx, err) {
    ctx.status = 500;
    ctx.body = JSON.stringify({
        msg: err.message,
        stack: err.stack
    });
};

function logRequest(req, res) {
    requestLogger.info({
        request: {
            path: req.path,
            method: req.method,
            queryString: req.querystring,
            headers: req.headers,
            body: req.body
        },
        response: {
            headers: res.headers,
            body: res.body
        }
    });
};

exports = module.exports = mocking;