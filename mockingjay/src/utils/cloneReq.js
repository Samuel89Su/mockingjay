'use strict';

function clone(req) {
    const slave = {};
    if (req.headers && typeof req.headers === 'object') {
        slave.headers = {};
        for (const key in req.headers) {
            if (req.headers.hasOwnProperty(key)) {
                const val = req.headers[key];
                slave.headers[key] = val;
            }
        }
    }
    if (req.body) {
        slave.body = req.body;
    }
    
    return slave;
}

exports = module.exports = clone;