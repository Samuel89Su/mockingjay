'use strict';

var parse = require('co-body');
var copy = require('copy-to');

/**
 * @param [Object] opts
 *   - {String} jsonLimit default '1mb'
 *   - {String} formLimit default '56kb'
 *   - {string} encoding default 'utf-8'
 *   - {Object} extendTypes
 */

// default json types
const jsonTypes = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
];

// default form types
const formTypes = [
    'application/x-www-form-urlencoded',
];

// default text types
const textTypes = [
    'text/plain',
];

function formatOptions(opts, type) {
    var res = {};
    copy(opts).to(res);
    res.limit = opts[type + 'Limit'];
    return res;
}

function extendType(original, extend) {
    if (extend) {
        if (!Array.isArray(extend)) {
            extend = [extend];
        }
        extend.forEach(function (extend) {
            original.push(extend);
        });
    }
}

function checkEnable(types, type) {
    return types.indexOf(type) >= 0;
}

async function parseBody(ctx, opts) {
    if (opts.enableJson && ((opts.detectJSON && opts.detectJSON(ctx)) || ctx.request.is(jsonTypes))) {
        let jsonOpts = formatOptions(opts, 'json');
        return await parse.json(ctx, jsonOpts);
    }
    if (opts.enableForm && ctx.request.is(formTypes)) {
        let formOpts = formatOptions(opts, 'form');
        return await parse.form(ctx, formOpts);
    }
    if (opts.enableText && ctx.request.is(textTypes)) {
        let textOpts = formatOptions(opts, 'text');
        return await parse.text(ctx, textOpts) || '';
    }
    return {};
}

async function bodyParser(ctx, opts) {
    opts = opts || {};
    var detectJSON = opts.detectJSON;
    var onerror = opts.onerror;

    let enableTypes = opts.enableTypes || ['json', 'form'];
    opts.enableForm = checkEnable(enableTypes, 'form');
    opts.enableJson = checkEnable(enableTypes, 'json');
    opts.enableText = checkEnable(enableTypes, 'text');

    // force co-body return raw body
    opts.returnRawBody = true;

    var extendTypes = opts.extendTypes || {};

    extendType(jsonTypes, extendTypes.json);
    extendType(formTypes, extendTypes.form);
    extendType(textTypes, extendTypes.text);

    if (ctx.request.body !== undefined) return;
    if (ctx.disableBodyParser) return;
    try {
        const res = await parseBody(ctx, opts);
        ctx.request.body = 'parsed' in res ? res.parsed : {};
        if (ctx.request.rawBody === undefined) ctx.request.rawBody = res.raw;
    } catch (err) {
        if (onerror) {
            onerror(err, ctx);
        } else {
            throw err;
        }
    }
}

exports = module.exports = bodyParser;