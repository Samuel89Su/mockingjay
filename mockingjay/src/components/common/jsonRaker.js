function rake(json, schema) {
    if (!json || !schema) {
        return
    } else if (typeof json !== 'object' && typeof json !== 'array') {
        return
    } else if (json instanceof Array) {
        for (let index = 0; index < json.length; index++) {
            const item = json[index];
            rake(item, schema.items)
        }
    } else if (typeof json === 'object') {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                const prop = json[key];
                if (!schema.properties[key]) {
                    delete json[key]
                } else {
                    rake(prop, schema.properties[key])
                }
            }
        }
    }
}

exports = module.exports = rake