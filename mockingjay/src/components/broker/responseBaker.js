'use strict';

const Http = require('http');
const VM = require('vm');
const cloneReq = require('../utils/cloneReq');
const logger = require('../common/logger');
const validationConst = require('../common/validationConst');


const reservedHeaderKeys = ['content-type', 'content-length', 'date', 'connection', 'status',
    'content-encoding', 'cache-control', 'age', 'etag', 'expires',
    'last-modified', 'server'
];

class ResponseBaker {
    constructor(arg) {
        this.bake = this.bake.bind(this);
        this.processReservedHeader = this.processReservedHeader.bind(this);
        this.responseValueFactory = this.responseValueFactory.bind(this);
    }

    async bake(ctx, responseDescriptor) {

        // bake body first, some header would be set after body get value.
        if (responseDescriptor.body && !responseDescriptor.body.optional) {
            if (responseDescriptor.body.reactor) {
                let reactor = responseDescriptor.body.reactor;
                switch (reactor.type) {
                    case validationConst.valReactorTypes.fixed:
                        ctx.response.body = reactor.value;
                        break;
                    case validationConst.valReactorTypes.custom:
                        {
                            let reactorResult = this.responseValueFactory(ctx.request, reactor.value);
                            if (!reactorResult.errMsg) {
                                ctx.response.body = reactorResult.data;
                            } else {
                                ctx.response.body = reactorResult.errMsg;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        // bake headers
        if (responseDescriptor.headers && responseDescriptor.headers.length > 0) {
            for (let i = 0; i < responseDescriptor.headers.length; i++) {
                const header = responseDescriptor.headers[i];
                if (!header.optional) {
                    if (reservedHeaderKeys.includes(header.key)) {
                        if (this.processReservedHeader(ctx, header)) {
                            ctx.response.body = reactorResult.errMsg;
                        }
                    } else {
                        switch (header.reactor.type) {
                            case validationConst.valReactorTypes.fixed:
                                ctx.response.headers[header.key] = header.reactor.value;
                                break;
                            case validationConst.valReactorTypes.custom:
                                {
                                    let reactorResult = this.responseValueFactory(ctx.request, header.reactor.value);
                                    if (!reactorResult.errMsg) {
                                        ctx.set(header.key, reactorResult.data);
                                    } else {
                                        ctx.response.body = reactorResult.errMsg;
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }

                } else {
                    // random

                }
            }
        }
    }

    // return error message
    processReservedHeader(ctx, headerDescriptor) {
        let errMsg = null;
        let val = null;
        switch (headerDescriptor.reactor.type) {
            case validationConst.valReactorTypes.fixed:
                val = headerDescriptor.reactor.value;
                break;
            case validationConst.valReactorTypes.custom:
                {
                    let reactorResult = this.responseValueFactory(ctx.request, headerDescriptor.reactor.value);
                    if (!reactorResult.errMsg) {
                        val = reactorResult.data;
                    } else {
                        errMsg = reactorResult.errMsg;
                    }
                }
                break;
            default:
                break;
        }

        if (errMsg) {
            return errMsg;
        }

        if (val) {
            switch (headerDescriptor.key) {
                case 'content-type':
                    ctx.response.type = val;
                    break;

                default:
                    break;
            }
        }

        return errMsg;
    }

    // return { data: null, errMsg: null }
    responseValueFactory(req, rawScript) {
        try {
            let dummyReq = cloneReq(req);

            let sandbox = {
                request: dummyReq,
                retVal: null,
            };
            VM.createContext(sandbox);
            VM.runInContext(rawScript, sandbox);

            let result = {
                data: sandbox.retVal,
                errMsg: null
            };
            return result;
        } catch (error) {
            logger.error(error);
            return { data: null, errMsg: `error in custom value generation { ${ rawScript } }, msg: ${ error.message }` };
        }
    }
}

exports = module.exports = new ResponseBaker();