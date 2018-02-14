'use strict';

const validationConst = require('./validationConst');

const valValidators = [
    {
        type: validationConst.validatorTypes.exact,
        value: 10,
        errMsg: 'invalid id'
    },
    {
        type: validationConst.validatorTypes.regEx,
        value: '^(\\d{2,4})$',
        errMsg: 'not match'
    },
    {
        type: validationConst.validatorTypes.custom,
        value: "function(val) { return 'out of range.'; }"
    }];


const valRectors = [
    { type: validationConst.valReactorTypes.fixed, value: 'gyugyu575' },
    { type: validationConst.valReactorTypes.custom, value: "function(req) { return req.headers['content-type'];}" }
];

const apiConfigSample = {
    appId: 3,
    config: {
        mock: true,             // true: mocking, false: forward
        forwardTarget: 'dev',
        actualUrl: {
            dev: 'http://localhost:3100/login',
            beta: 'http://localhost:3101/login',
        },
        logReq: 3,          // 0: not logging, 1: logging valid req, 2: logging invalid req
    },
    desc: {
        appName: 'shrimpball',
        path: '/login',
        method: 'POST',
        inspectReq: true,
        requestDescriptor: {
            contentTypes: ['application/json'],
            queries: [
                {
                    key: 'id',
                    required: true,
                    validators: [valValidators[1]]
                }
            ],
            headers: [
                {},
            ],
            body: {}
        },
        responseDescriptor: {
            headers: [
                {
                    key: 'content-type',
                    optional: false,
                    reactor: valRectors[1]
                }
            ],
            bodyReactor: { type: validationConst.valReactorTypes.custom, value: "function(req) { return req.body;}" }
        }
    }
}

exports = module.exports = apiConfigSample;