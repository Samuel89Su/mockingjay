'use strict'

/**
 * 
 * @param {Object|Number|String} obj 
 * @returns {Object} json schema
 */
function generateSchemaFromJson(obj) {
    let schema = {
        '$schema': 'http://json-schema.org/draft-06/schema#'
    }
    if (typeof obj !== 'object') {
        switch (typeof obj) {
            case 'string':
                schema.type = 'String'
                break
            case 'number':
                schema.type = 'Number'
                break
            default:
                break;
    }
    } else {
        schema.type = 'Object'
        if (obj !== {}) {
            schema.properties = {}
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const propVal = obj[key];
                    schema.properties[key] = internalGenerate(propVal)
                }
            }
        }
    }
    return schema
}

function internalGenerate(obj) {
    let schema = {}
    if (typeof obj !== 'object') {
        switch (typeof obj) {
            case 'string':
                schema.type = 'String'
                break
            case 'number':
                schema.type = 'Number'
                break
            default:
                break;
        }
    } else if (obj instanceof Array) {
        schema.type = 'Array'
        if (obj.length > 0) {
            let first = obj[0]
            schema.items = internalGenerate(first)
        }
    } else {
        schema.type = 'Object'
        if (obj !== {}) {
            schema.properties = {}
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const propVal = obj[key];
                    schema.properties[key] = internalGenerate(propVal)
                }
            }
        }
    }
    return schema
}

// console.log(JSON.stringify(generateSchemaFromJson(1)))
// console.log(JSON.stringify(generateSchemaFromJson('123')))
// console.log(JSON.stringify(generateSchemaFromJson([1,2,3])))
// console.log(JSON.stringify(generateSchemaFromJson({ id: 1, name: 'james', hobbies: ['basketball', 'skiting'], pareants: { name: 'jane', age: 43, hobbies: ['cooking'] } })))

exports = module.exports = generateSchemaFromJson