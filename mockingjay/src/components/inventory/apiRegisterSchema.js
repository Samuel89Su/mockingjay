const apiRegisterSchema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "method": {
            "type": "string",
            "pattern": "(GET|POST)"
        },
        "appId": {
            "type": "integer",
            "minimum": 1
        }
    },
    "required": ["name", "path", "method", "appId"]
}

exports = module.exports = apiRegisterSchema