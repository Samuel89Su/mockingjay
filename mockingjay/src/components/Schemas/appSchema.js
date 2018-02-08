const schema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "type": "object",
    "properties": {
        "id": {
            "type": "integer",
            "minimum": 0
        },
        "name": {
            "type": "string",
            "minLength": 2,
            "maxLength": 30
        },
        "desc": {
            "type":"string",
            "maxLength": 200
        },
        "staticForwardTarget": {
            "type":"string"
        },
        "apiForwardTarget": {
            "type":"string"
        },
        "targets": {
            "type":"object"
        }
    },
    "required": [
        "id", "name"
    ]
}

exports = module.exports = schema