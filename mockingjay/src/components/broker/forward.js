'use strict';

const promisedReq = require('request-promise');

async function forward(req, baseUrl, path) {
    let opts = {};
    opts.resolveWithFullResponse = true;
    opts.baseUrl = baseUrl;
    opts.url = path;
    opts.method = req.method;

    opts.headers = req.headers;
    opts.headers.host = null;

    opts.qs = req.query;

    // opts.body = req.incommingMessage;

    let res = await promisedReq(opts)
        .then((response) => {
            // Access response.statusCode, response.body etc.
            let resOpts = {};
            resOpts.headers = response.headers;
            resOpts.body = response.body;

            return resOpts;
        })
        .catch((err) => {
            return { body: { name: err.name, message: err.message } };
        });

    return res;
};

exports = module.exports = forward;