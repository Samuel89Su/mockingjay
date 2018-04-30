'use strict';

exports = module.exports = {

    success: function (data) { return { code: 0, msg: 'success', data: data } },

    invalidArguments: function () { return { code: 100, msg: 'invalid arguments', data: null } },

    dbErr: function () { return { code: 200, msg: 'invalid arguments', data: null } },

    // resource err
    resNotFound: function () { return { code: 404, msg: 'not found', data: null } },
    
    internalErr: (err) => { return { code: 500, msg: 'Internal Server Error', data: err } },

    permissionDenied: (msg) => { return { code: 401, msg: msg || 'permision denied' } }
}