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
                if (!schema.properties.hasOwnProperty(key)) {
                    delete json[key]
                } else {
                    json[key] = rake(prop, schema.properties[key])
                }
            }
        }
    }

    return json
}

exports = module.exports = rake