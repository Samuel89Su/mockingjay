'use strict';

const Http = require('http');
var Ajv = require('ajv');
const validationConst = require('../common/validationConst');

class RequestInspector {
    constructor(arg) {

    }

    async inspect(req, requestDescriptor) {
        let validationRes = {
            code: 200
        };

        // validate queries
        if (requestDescriptor.queries && requestDescriptor.queries.length > 0) {
            let reqQueries = req.query;
            for (let i = 0; i < requestDescriptor.queries.length; i++) {
                const queryDesciptor = requestDescriptor.queries[i];
                if (queryDesciptor.required && !reqQueries[queryDesciptor.key]) {
                    validationRes.code = 400;
                    validationRes.msg = 'key ' + queryDesciptor.key + ' is missing.';
                    // stop do any other query validation
                    return validationRes;
                } else if (reqQueries[queryDesciptor.key]) {
                    let validator = queryDesciptor.validator;
                    let valid = true;
                    let errMsg = null;
                    if (validator) {
                        switch (validator.type) {
                            case validationConst.validatorTypes.exact:
                                {
                                    valid = reqQueries[queryDesciptor.key] === validator.value;
                                }
                                break;
                            case validationConst.validatorTypes.regEx:
                                {
                                    let regex = {};
                                    eval('regex = new RegExp(validator.value)');
                                    if (!regex.test(reqQueries[queryDesciptor.key])) {
                                        valid = false;
                                    }
                                }
                                break;
                            case validationConst.validatorTypes.custom:
                                {
                                    let cusErrMsg = this.customValidatorSandbox(reqQueries[queryDesciptor.key], validator.value);
                                    if (cusErrMsg) {
                                        valid = false;
                                        validator.errMsg = cusErrMsg;
                                    }
                                }
                                break;
                            default:
                                break;
                        }

                        // stop process any other validator
                        if (!valid) {
                            errMsg = validator.errMsg;
                            break;
                        }
                    }

                    // stop do any other query validation
                    if (!valid) {
                        validationRes.code = 400;
                        validationRes.errMsg = errMsg;
                        return validationRes;
                    }
                }
            }
        }

        // validate headers
        if (requestDescriptor.headers && requestDescriptor.headers.length > 0) {
            let reqHeaders = req.headers;
            for (let i = 0; i < requestDescriptor.headers.length; i++) {
                const headerDesciptor = requestDescriptor.headers[i];
                if (headerDesciptor.required && !reqHeaders[headerDesciptor.key]) {
                    validationRes.code = 400;
                    validationRes.msg = 'key ' + headerDesciptor.key + ' is missing.';
                    // stop do any other query validation
                    return validationRes;
                } else if (reqHeaders[headerDesciptor.key]) {
                    let validator = headerDesciptor.validator;
                    let valid = true;
                    let errMsg = null;
                    if (validator) {
                        switch (validator.type) {
                            case validationConst.validatorTypes.exact:
                                {
                                    valid = reqHeaders[headerDesciptor.key] === validator.value;
                                }
                                break;
                            case validationConst.validatorTypes.regEx:
                                {
                                    let regex = {};
                                    eval('regex = new RegExp(validator.value)');
                                    if (!regex.test(reqHeaders[headerDesciptor.key])) {
                                        valid = false;
                                    }
                                }
                                break;
                            case validationConst.validatorTypes.custom:
                                {
                                    let cusErrMsg = this.customValidatorSandbox(reqHeaders[headerDesciptor.key], validator.value);
                                    if (cusErrMsg) {
                                        valid = false;
                                        validator.errMsg = cusErrMsg;
                                    }
                                }
                                break;
                            default:
                                break;
                        }

                        // stop process any other validator
                        if (!valid) {
                            errMsg = validator.errMsg;
                            break;
                        }
                    }

                    // stop do any other query validation
                    if (!valid) {
                        validationRes.code = 400;
                        validationRes.errMsg = errMsg;
                        return validationRes;
                    }
                }
            }
        }

        // validate body
        if (requestDescriptor.body && requestDescriptor.body.required) {
            if (!req.body) {
                validationRes.code = 400;
                validationRes.msg = 'body is missing.';
            } else {
                let validator = requestDescriptor.body.validator;
                let valid = true;
                let errMsg = null;
                if (validator) {
                    switch (validator.type) {
                        case validationConst.validatorTypes.exact:
                            {
                                valid = req.body === validator.value;
                            }
                            break;
                        case validationConst.validatorTypes.regEx:
                            {
                                let regex = {};
                                eval('regex = new RegExp(validator.value)');
                                if (!regex.test(req.body)) {
                                    valid = false;
                                }
                            }
                            break;
                        case validationConst.validatorTypes.custom:
                            {
                                let cusErrMsg = this.customValidatorSandbox(req.body, validator.value);
                                if (cusErrMsg) {
                                    valid = false;
                                    errMsg = cusErrMsg;
                                }
                            }
                            break;
                        case validationConst.validatorTypes.jsonSchema:
                            {
                                const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
                                const validate = ajv.compile(JSON.parse(validator.value));
                                // validate
                                valid = validate(req.body);
                                if (!valid) {
                                    errMsg = JSON.stringify(validate.errors);
                                }
                            }
                            break;
                        default:
                            break;
                    }

                    // stop process any other validator
                    if (!valid) {
                        validationRes.code = 400;
                        validationRes.errMsg = errMsg;
                        return validationRes;
                    }
                }
            }
        }

        return validationRes;
    }

    // return error message
    customValidatorSandbox(val, rawFunc) {
        let tempFunc = null;
        let errMsg = null;
        try {
            eval('tempFunc = ' + rawFunc);
            errMsg = tempFunc(val);
        } catch (error) {
            errMsg = 'error in custom value generation function: ' + rawFunc + ', msg: ' + error.message;
        }

        return errMsg;
    }
}

exports = module.exports = new RequestInspector();