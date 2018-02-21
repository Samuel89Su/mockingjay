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

/**
 * 
 * @param {Boolean} desc true: desc, false: asc
 * @param {String} propName sort prop name
 * @param {Function} preProcessor process before compare
 * @returns {Function} 
 */
function getComparer (propName, desc, preProcessor) {
    if (!desc) {
        desc = false
    }

    if (!propName) {
        if (!desc) {
            return function sort (a, b) {
                return compare(a, b, preProcessor)
            }
        } else {
            return function sort (a, b) {
                return compare(b, a, preProcessor)
            }
        }
    } else {
        if (!desc) {
            return function sort (a, b) {
                return compare(a[propName], b[propName], preProcessor)
            }
        } else {
            return function sort (a, b) {
                return compare(b[propName], a[propName], preProcessor)
            }
        }
    }
}

function compare(a, b, preProcessor) {
    if (preProcessor) {
        a = preProcessor(a)
        b = preProcessor(b)
    }
    if (typeof a === 'string') {
        return a === b ? 0 : (a > b ? 1 : -1)
    } else if (!Number.isNaN(a)) {
        return a - b
    } else {
        return 0
    }
}

function parse(rawValue) {
    try {
        if (typeof rawValue === 'string') {
            try {
                rawValue = JSON.parse(rawValue)
                rawValue = parse(rawValue)
            } catch (err) {
                return rawValue
            }
        } else if (typeof rawValue === 'object') {
            if (rawValue instanceof Array) {
                for (let i = 0; i < rawValue.length; i++) {
                    const item = rawValue[i]
                    rawValue[i] = parse(item)
                }
            } else {
                for (const key in rawValue) {
                    if (rawValue.hasOwnProperty(key)) {
                        const prop = rawValue[key];
                        rawValue[key] = parse(prop)
                    }
                }
            }
        }

        return rawValue
    } catch (error) {
        // console.log(error)
    }
}

/**
 * Rake object by schema
 * @param {object} json
 * @param {object} schema
 * @returns {object} new object
 */
function rake(json, schema) {
    if (!json || !schema) {
        return null
    } else if (typeof json !== 'object' && !(json instanceof Array)) {
        return json
    } else if (json instanceof Array) {
        for (let index = 0; index < json.length; index++) {
            const item = json[index];
            json[index] = rake(item, schema.items)
        }
    } else if (typeof json === 'object') {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                const prop = json[key];
                if (!schema.properties[key]) {
                    delete json[key]
                } else {
                    schema.properties[key] = rake(prop, schema.properties[key])
                }
            }
        }
    }

    return json
}

exports = module.exports = { clone, getComparer, parse, rake };