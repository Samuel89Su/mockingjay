exports = modul.exports = {    
    "$schema": "http://json-schema.org/draft-06/schema#",
    "type": "object",
    "properties": {
        "apiId": {
            "type": "integer",
            "minimum": 1
        },
        "appId": {
            "type":"integer",
            "minimum": 1
        },
        "name": {
            "type":"string",
            "minLength": 2,
            "maxLength": 30
        },
        "description": {
            "type": "string",
            "maxLength": 200
        },
        "path": {
            "type": "string",
            "minLength": 2,
            "maxLength": 120
        },
        "method": {
            "type": "string",
            "pattern": "(GET|POST)"
        },
        "validate": {
            "type": "boolean",
            "default": false
        },
        "schema": {
            "type": "object"
        },
        "forward": {
            "type": "boolean",
            "default": false
        },
        "logReq": {
            "type": "integer",
            "minimum": 0,
            "maximum": 16,
            "default": 0
        }
    },
    "required": [
        "appId", "name", "path", "method", "validate"
    ]
}